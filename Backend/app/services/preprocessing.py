"""Image preprocessing - an exact port of the pipeline in rr.ipynb.

Image -> grayscale -> Otsu threshold (computed on the original) -> aspect-preserving
resize to 224x224 with white padding -> pure black/white -> 3 channels -> ResNet50 preprocess.
"""
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet50_preprocess_input

IMG_HEIGHT = 224
IMG_WIDTH = 224
USE_OTSU = True
FIXED_THRESHOLD = 127.0


def otsu_threshold(gray: tf.Tensor) -> tf.Tensor:
    hist = tf.cast(tf.histogram_fixed_width(gray, [0.0, 256.0], nbins=256), tf.float32)
    bins = tf.range(256, dtype=tf.float32)
    w_bg = tf.cumsum(hist)
    w_fg = tf.reduce_sum(hist) - w_bg
    s_all = tf.reduce_sum(hist * bins)
    s_bg = tf.cumsum(hist * bins)
    m_bg = s_bg / tf.maximum(w_bg, 1.0)
    m_fg = (s_all - s_bg) / tf.maximum(w_fg, 1.0)
    between_class_variance = w_bg * w_fg * tf.square(m_bg - m_fg)
    return tf.cast(tf.argmax(between_class_variance), tf.float32)


def binarize(image_bytes: bytes) -> tf.Tensor:
    """Raw image bytes -> uint8 [224, 224, 1] tensor of only 0 / 255."""
    img = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
    img.set_shape([None, None, 3])

    gray = tf.image.rgb_to_grayscale(tf.cast(img, tf.float32))
    thr = otsu_threshold(gray) if USE_OTSU else FIXED_THRESHOLD

    # resize_with_pad pads with 0, so invert -> resize -> invert back to get white padding
    inverted = 255.0 - gray
    inverted = tf.image.resize_with_pad(inverted, IMG_HEIGHT, IMG_WIDTH, antialias=True)
    gray = 255.0 - inverted

    bw = tf.where(gray > thr, 255.0, 0.0)
    return tf.cast(bw, tf.uint8)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Raw image bytes -> float32 array of shape [1, 224, 224, 3] ready for the model."""
    bw = binarize(image_bytes)
    x = tf.tile(tf.cast(bw, tf.float32), [1, 1, 3])
    x = resnet50_preprocess_input(x)
    return x.numpy()[np.newaxis, ...]
