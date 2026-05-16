import os
from pathlib import Path

import cv2


def main():
    input_path = os.environ.get(
        "VIDEO_PATH",
        r"C:\Users\vip\Downloads\WhatsApp Video 2026-04-22 at 12.58.53 AM.mp4",
    )
    out_dir = Path(os.environ.get("OUT_DIR", r"assets\video-frames"))
    every_seconds = float(os.environ.get("EVERY_SECONDS", "3"))
    max_frames = int(os.environ.get("MAX_FRAMES", "40"))

    out_dir.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise SystemExit(f"Could not open video: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)

    step = max(1, int(round(fps * every_seconds)))
    indices = list(range(0, total_frames, step))
    if max_frames > 0:
        indices = indices[:max_frames]

    written = 0
    for i, frame_idx in enumerate(indices, start=1):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ok, frame = cap.read()
        if not ok or frame is None:
            continue
        out_path = out_dir / f"frame_{i:04d}.jpg"
        cv2.imwrite(str(out_path), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 86])
        written += 1

    cap.release()
    print(
        f"Wrote {written} frames to {out_dir} "
        f"(fps={fps:.2f}, step={step} frames, total={total_frames})"
    )


if __name__ == "__main__":
    main()

