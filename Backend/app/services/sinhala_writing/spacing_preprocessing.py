"""Image preprocessing and word-gap measurement for Sinhala word-spacing detection.

These are the same steps and settings used in the training notebooks.
If you change any setting here, the model must be retrained with the same change.
"""
import numpy as np
import cv2

TARGET_W       = 2000   # every image is resized to this width
MIN_AREA       = 60     # ink blobs smaller than this (pixels) are noise
SMALL_REL      = 0.25   # blobs smaller than 25% of letter height are dropped (full stops, specks)
FAINT_REL      = 0.5    # blobs less than half as dark as a typical stroke are erased marks
BAND_REL       = 1.2    # blobs further than 1.2 x letter height from the writing line are dropped
WORD_GAP_RATIO = 0.4    # gap wider than 0.4 x letter height = WORD gap, smaller = LETTER gap

FEATURES = ['n_words', 'wg_mean', 'wg_median', 'wg_min', 'wg_max', 'wg_std', 'wg_cv',
            'gap1', 'gap2', 'gap3', 'ww_mean', 'ww_median', 'gap_to_word',
            'lg_mean', 'lg_max', 'wg_to_lg', 'space_ratio', 'text_len']


class NoHandwritingError(ValueError):
    """Raised when no handwriting line can be found in the image."""


def resize_gray(gray):
    """Resize a grayscale image to a fixed width."""
    scale = TARGET_W / gray.shape[1]
    interp = cv2.INTER_AREA if scale < 1 else cv2.INTER_CUBIC
    return cv2.resize(gray, (TARGET_W, max(1, round(gray.shape[0] * scale))), interpolation=interp)


def ink_darkness(gray):
    """Lighting correction. 0 = paper, 255 = darkest ink (removes shadows / uneven light)."""
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41))
    paper = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, k)   # closing wipes out thin strokes -> paper only
    flat = cv2.divide(gray, paper, scale=255)
    return 255 - flat


def binarize(dark):
    """Otsu over non-paper pixels only, with hysteresis:
    lighter pixels are kept only if they touch a clearly dark stroke (keeps faint pencil, drops ghosts)."""
    vals = dark[dark > 10]
    if vals.size < 100:
        t = 40.0
    else:
        t, _ = cv2.threshold(vals.reshape(-1, 1), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        t = max(t, 20.0)
    strong = dark > t
    weak = (dark > t * 0.5).astype(np.uint8)
    n, lab = cv2.connectedComponents(weak, connectivity=8)
    keep = np.zeros(n, bool)
    keep[np.unique(lab[strong])] = True
    keep[0] = False
    return (keep[lab] * 255).astype(np.uint8)


def remove_ruled_line(binary):
    """Find and erase the long horizontal ruled line.
    Also returns where it starts, to drop printed labels like 'IV.' on its left."""
    W = binary.shape[1]
    horiz = cv2.morphologyEx(binary, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (W // 15, 1)))
    xs = np.where(horiz.any(axis=0))[0]
    line_x0 = int(xs.min()) if xs.size else 0
    horiz = cv2.dilate(horiz, cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5)))
    cleaned = cv2.subtract(binary, horiz)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))   # re-join tiny breaks
    return cleaned, line_x0


def clean_components(binary, dark, line_x0):
    """Keep only the handwriting blobs. Returns (mask, letter_height_px, (band_top, band_bottom))."""
    W = binary.shape[1]
    n, lab, stats, _ = cv2.connectedComponentsWithStats(binary, connectivity=8)
    comps = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if area < MIN_AREA:
            continue
        if line_x0 > 0.05 * W and x + w < line_x0 - 10:      # completely left of the ruled line -> printed label
            continue
        comps.append(dict(id=i, x=x, y=y, w=w, h=h, area=area, cy=y + h / 2,
                          dark=float(np.median(dark[lab == i]))))
    if not comps:
        return None, None, None

    med_dark = np.median([c['dark'] for c in comps])
    comps = [c for c in comps if c['dark'] >= FAINT_REL * med_dark]          # erased / ghost marks

    h_est = np.median([c['h'] for c in comps])
    comps = [c for c in comps if max(c['w'], c['h']) >= SMALL_REL * h_est]  # full stops, specks

    # writing line = area-weighted median of blob centres; drop blobs far above/below it
    order = sorted(comps, key=lambda c: c['cy'])
    cum = np.cumsum([c['area'] for c in order])
    y_line = order[int(np.searchsorted(cum, cum[-1] / 2))]['cy']
    comps = [c for c in comps if abs(c['cy'] - y_line) <= BAND_REL * h_est]
    if not comps:
        return None, None, None

    # letter height = median height of the main blobs (ignores separate small pili)
    letter_h = float(np.median([c['h'] for c in comps if c['h'] >= 0.5 * h_est] or [h_est]))
    mask = np.isin(lab, [c['id'] for c in comps]).astype(np.uint8) * 255
    band = (int(min(c['y'] for c in comps)), int(max(c['y'] + c['h'] for c in comps)))
    return mask, letter_h, band


def find_runs(flags):
    """(start, end) of every run of True values; end is exclusive."""
    d = np.diff(np.concatenate([[0], flags.astype(int), [0]]))
    return list(zip(np.where(d == 1)[0], np.where(d == -1)[0]))


def measure_line(gray):
    """Full preprocessing + gap measurement for one grayscale line image."""
    gray = resize_gray(gray)
    dark = ink_darkness(gray)
    no_line, line_x0 = remove_ruled_line(binarize(dark))
    mask, h, band = clean_components(no_line, dark, line_x0)
    if mask is None:
        raise NoHandwritingError('no handwriting found')

    ink_runs = find_runs(mask.any(axis=0))                        # columns that contain ink
    gaps = [(ink_runs[i][1], ink_runs[i + 1][0]) for i in range(len(ink_runs) - 1)]
    gap_w = np.array([b - a for a, b in gaps], float) / h         # gap width in "letter heights"
    is_word = gap_w > WORD_GAP_RATIO

    # join ink runs separated only by letter gaps -> words
    words, start = [], ink_runs[0][0]
    for (a, b), w in zip(gaps, is_word):
        if w:
            words.append((start, a))
            start = b
    words.append((start, ink_runs[-1][1]))

    return dict(gray=gray, mask=mask, h=h, band=band, gaps=gaps, gap_w=gap_w, is_word=is_word, words=words)


def make_features(m):
    """Scale-free features (all divided by letter height)."""
    wg = m['gap_w'][m['is_word']]                                  # word gaps
    lg = m['gap_w'][~m['is_word']]                                 # letter gaps (inside words)
    ww = np.array([b - a for a, b in m['words']], float) / m['h']  # word widths
    top = np.sort(m['gap_w'])[::-1][:3]
    top = np.pad(top, (0, 3 - len(top)))
    extent_px = m['words'][-1][1] - m['words'][0][0]
    gap_px = sum(b - a for a, b in m['gaps'])

    wg_mean = wg.mean() if len(wg) else 0.0
    wg_median = float(np.median(wg)) if len(wg) else 0.0
    wg_std = wg.std() if len(wg) else 0.0
    lg_mean = lg.mean() if len(lg) else 0.0
    return dict(
        n_words=len(m['words']),
        wg_mean=wg_mean, wg_median=wg_median,
        wg_min=wg.min() if len(wg) else 0.0, wg_max=wg.max() if len(wg) else 0.0,
        wg_std=wg_std, wg_cv=wg_std / wg_mean if wg_mean > 0 else 0.0,
        gap1=top[0], gap2=top[1], gap3=top[2],
        ww_mean=ww.mean(), ww_median=float(np.median(ww)),
        gap_to_word=wg_median / float(np.median(ww)),
        lg_mean=lg_mean, lg_max=lg.max() if len(lg) else 0.0,
        wg_to_lg=wg_median / max(lg_mean, 0.05),
        space_ratio=gap_px / max(extent_px, 1),
        text_len=extent_px / m['h'],
    )


def draw_gaps(m, good_range=None):
    """BGR image with word gaps coloured: green = OK, red = too wide, orange = too narrow."""
    vis = cv2.cvtColor(m['gray'], cv2.COLOR_GRAY2BGR)
    vis[m['mask'] > 0] = (200, 80, 0)
    y0, y1 = m['band']
    overlay = vis.copy()
    word_no = 0
    for (a, b), g, word in zip(m['gaps'], m['gap_w'], m['is_word']):
        if not word:
            continue
        word_no += 1
        color = (0, 170, 0)
        if good_range is not None:
            if g > good_range[1]:
                color = (0, 0, 230)
            elif g < good_range[0]:
                color = (0, 140, 255)
        cv2.rectangle(overlay, (a, y0), (b, y1), color, -1)
        cv2.putText(vis, str(word_no), ((a + b) // 2 - 10, max(y0 - 12, 30)), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
    return cv2.addWeighted(overlay, 0.35, vis, 0.65, 0)