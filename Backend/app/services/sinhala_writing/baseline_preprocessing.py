"""
Preprocessing + feature extraction for the baseline deviation model.
Copied from the Random Forest notebook (Steps 5 and 6). Do not change these steps
unless you retrain the model with the same changes.
"""
import cv2
import numpy as np

FEATURE_NAMES = ["line_found", "n_words", "mean_gap", "median_gap", "std_gap", "max_gap", "min_gap",
                 "max_abs_gap", "mean_abs_gap", "gap_range", "first_gap", "last_gap", "first_last_diff",
                 "drift_slope", "abs_drift_slope", "waviness", "mean_step", "frac_floating", "frac_below",
                 "frac_on_line", "below_ink_ratio", "word_height_cv"]

ON_LINE_TOL = 0.35   # |gap| <= this many character heights counts as "on the line" (same as the notebook)


# ----------------------------------------------------------------------------- preprocessing (Step 5)
def binarize(img):
    binary = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 41, 15)
    return cv2.morphologyEx(binary, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))


def guide_line_angle(binary, max_angle=20):
    # angle (degrees) of the longest near-horizontal straight line; 0 if none
    W = binary.shape[1]
    segs = cv2.HoughLinesP(binary, 1, np.pi / 720, threshold=150,
                           minLineLength=int(0.25 * W), maxLineGap=25)
    if segs is None:
        return 0.0
    angles, lengths = [], []
    for x1, y1, x2, y2 in segs.reshape(-1, 4):
        a = np.degrees(np.arctan2(y2 - y1, x2 - x1))
        if abs(a) <= max_angle:
            angles.append(a); lengths.append(np.hypot(x2 - x1, y2 - y1))
    if not angles:
        return 0.0
    order = np.argsort(angles)
    angles, lengths = np.array(angles)[order], np.array(lengths)[order]
    cum = np.cumsum(lengths)
    return float(angles[np.searchsorted(cum, cum[-1] / 2)])        # length-weighted median


def rotate(img, angle):
    h, w = img.shape
    M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
    return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def preprocess(gray, target_width=1600):
    """grayscale -> resize -> CLAHE -> denoise -> deskew (guide line only). Returns the 'final' image."""
    h, w = gray.shape
    scale = target_width / w
    gray = cv2.resize(gray, (target_width, max(1, round(h * scale))),
                      interpolation=cv2.INTER_AREA if scale < 1 else cv2.INTER_CUBIC)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(gray)
    denoised = cv2.fastNlMeansDenoising(clahe, None, h=10, templateWindowSize=7, searchWindowSize=21)
    angle = guide_line_angle(binarize(denoised))
    return rotate(denoised, angle) if angle != 0.0 else denoised


# ----------------------------------------------------------------------------- features (Step 6)
def line_candidates(binary):
    H, W = binary.shape
    k = max(40, W // 12)
    horiz = cv2.morphologyEx(binary, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (k, 1)))
    horiz = cv2.dilate(horiz, cv2.getStructuringElement(cv2.MORPH_RECT, (31, 3)))   # bridge faint gaps
    n, labels, stats, _ = cv2.connectedComponentsWithStats(horiz)
    cands = []
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if w < 0.30 * W or h > 0.15 * H:
            continue
        ys, xs = np.where(labels == i)
        vx, vy, x0, y0 = cv2.fitLine(np.column_stack([xs, ys]).astype(np.float32),
                                     cv2.DIST_HUBER, 0, 0.01, 0.01).flatten()
        slope = vy / vx if abs(vx) > 1e-6 else 0.0
        cands.append({"slope": float(slope), "intercept": float(y0 - slope * x0), "label": i})
    return cands, labels


def extract_features(gray, return_debug=False):
    binary = binarize(gray)
    H, W = binary.shape
    cands, line_labels = line_candidates(binary)

    # remove detected guide lines from the ink image
    text_bw = binary.copy()
    if cands:
        line_mask = np.isin(line_labels, [c["label"] for c in cands]).astype(np.uint8) * 255
        line_mask = cv2.dilate(cv2.bitwise_and(line_mask, binary), np.ones((3, 1), np.uint8))
        text_bw = cv2.subtract(text_bw, line_mask)
        text_bw = cv2.morphologyEx(text_bw, cv2.MORPH_CLOSE, np.ones((5, 1), np.uint8))

    # blank a thin border (paper edges / shadows) and drop noise specks
    m = max(4, int(0.01 * min(H, W)))
    text_bw[:m, :] = 0; text_bw[-m:, :] = 0; text_bw[:, :m] = 0; text_bw[:, -m:] = 0
    n, labels, stats, _ = cv2.connectedComponentsWithStats(text_bw)
    keep = np.zeros(n, bool); keep[1:] = stats[1:, cv2.CC_STAT_AREA] >= 25
    text_bw = (keep[labels] * 255).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(text_bw)

    empty = {k: np.nan for k in FEATURE_NAMES}; empty.update(line_found=int(bool(cands)), n_words=0)
    if n <= 1:
        return (empty, None) if return_debug else empty

    # typical character height
    areas, heights = stats[1:, cv2.CC_STAT_AREA], stats[1:, cv2.CC_STAT_HEIGHT]
    big = heights[areas >= np.percentile(areas, 30)]
    char_h = max(8.0, float(np.median(big)) if len(big) else float(np.median(heights)))

    # group letters into words
    kw, kh = max(5, int(0.6 * char_h)) | 1, max(3, int(0.4 * char_h)) | 1
    merged = cv2.dilate(text_bw, cv2.getStructuringElement(cv2.MORPH_RECT, (kw, kh)))
    contours, _ = cv2.findContours(merged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    words = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        ys, xs = np.nonzero(text_bw[y:y + h, x:x + w])
        if len(ys) < 0.15 * char_h * char_h:                   # full stops, dots, noise
            continue
        if w < 0.35 * char_h and h < 0.35 * char_h:
            continue
        if x <= m + 2 or x + w >= W - m - 2:                   # touches the page edge
            continue
        if h > 2.5 * char_h and w < 0.25 * h:                  # margin line / paper fold
            continue
        ys = ys + y
        words.append({"x": x, "y": y, "w": w, "h": h, "cx": x + w / 2.0,
                      "bottom": float(np.percentile(ys, 85)), "ys": ys})
    if not words:
        return (empty, None) if return_debug else empty
    words.sort(key=lambda d: d["cx"])
    bottoms = np.array([wd["bottom"] for wd in words])
    cxs = np.array([wd["cx"] for wd in words])

    # pick the guide line that the text is written on
    line = None
    if cands:
        def score(c):
            d = (c["slope"] * cxs + c["intercept"]) - bottoms
            return np.sum((d > -2 * char_h) & (d < 5 * char_h)) * 1000 - np.mean(np.abs(d))
        line = max(cands, key=score)
    line_y = line["slope"] * cxs + line["intercept"] if line else np.full_like(bottoms, bottoms[0])

    gaps = (line_y - bottoms) / char_h                         # + above line, − below line
    xn = (cxs - cxs.min()) / max(1.0, cxs.max() - cxs.min())   # 0 … 1 along the line
    if len(words) >= 2:
        drift, icpt = np.polyfit(xn, gaps, 1); resid = gaps - (drift * xn + icpt)
    else:
        drift, resid = 0.0, np.zeros(1)
    total_ink = sum(len(wd["ys"]) for wd in words)
    below_ink = sum(int(np.sum(wd["ys"] > ly + 0.25 * char_h)) for wd, ly in zip(words, line_y))
    hs = np.array([wd["h"] for wd in words], float)
    tol = ON_LINE_TOL

    f = {"line_found": int(line is not None), "n_words": len(words),
         "mean_gap": gaps.mean(), "median_gap": np.median(gaps), "std_gap": gaps.std(),
         "max_gap": gaps.max(), "min_gap": gaps.min(), "max_abs_gap": np.abs(gaps).max(),
         "mean_abs_gap": np.abs(gaps).mean(), "gap_range": gaps.max() - gaps.min(),
         "first_gap": gaps[0], "last_gap": gaps[-1], "first_last_diff": gaps[-1] - gaps[0],
         "drift_slope": drift, "abs_drift_slope": abs(drift), "waviness": resid.std(),
         "mean_step": np.abs(np.diff(gaps)).mean() if len(gaps) > 1 else 0.0,
         "frac_floating": np.mean(gaps > tol), "frac_below": np.mean(gaps < -tol),
         "frac_on_line": np.mean(np.abs(gaps) <= tol), "below_ink_ratio": below_ink / max(1, total_ink),
         "word_height_cv": hs.std() / max(1e-6, hs.mean())}
    f = {k: float(v) for k, v in f.items()}
    if not return_debug:
        return f
    return f, {"gray": gray, "words": words, "line": line, "line_y": line_y, "gaps": gaps, "char_h": char_h}


def draw_measurements(dbg):
    """RGB picture: green = guide line, blue = words, red = gap in character heights."""
    vis = cv2.cvtColor(dbg["gray"], cv2.COLOR_GRAY2RGB)
    W = vis.shape[1]
    if dbg["line"] is not None:
        L = dbg["line"]
        cv2.line(vis, (0, int(L["intercept"])), (W, int(L["slope"] * W + L["intercept"])), (0, 190, 0), 3)
    for wd, ly, g in zip(dbg["words"], dbg["line_y"], dbg["gaps"]):
        cv2.rectangle(vis, (wd["x"], wd["y"]), (wd["x"] + wd["w"], wd["y"] + wd["h"]), (30, 90, 255), 2)
        cx, b = int(wd["cx"]), int(wd["bottom"])
        cv2.line(vis, (cx, b), (cx, int(ly)), (230, 0, 0), 3); cv2.circle(vis, (cx, b), 6, (230, 0, 0), -1)
        cv2.putText(vis, f"{g:+.2f}", (wd["x"], max(22, wd["y"] - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (230, 0, 0), 2)
    return vis