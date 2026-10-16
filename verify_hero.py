"""Verify the hero GIF: dimensions, frames, loop seam, borders, coverage."""
import os

from PIL import Image, ImageChops, ImageStat

GIF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "hero.gif")

im = Image.open(GIF)
n = im.n_frames
frames = []
for i in range(n):
    im.seek(i)
    frames.append(im.convert("RGB"))

w, h = im.size
size_kb = os.path.getsize(GIF) / 1024
dur = im.info.get("duration")
loop = im.info.get("loop")


def meandiff(a, b):
    return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3


seam = meandiff(frames[-1], frames[0])
avg = sum(meandiff(frames[i], frames[(i + 1) % n]) for i in range(n)) / n

# border scan: nothing but near-background colors may touch the edge
# (old bug: violet ring artifacts crossing the canvas edge)
def is_bg(c, tol=18):
    return all(abs(a - b) <= tol for a, b in zip(c, (10, 12, 22)))

bad = 0
for f in frames:
    w_, h_ = f.size
    edge = []
    for x in range(0, w_, 8):
        edge += [f.getpixel((x, 0)), f.getpixel((x, h_ - 1))]
    for y in range(0, h_, 8):
        edge += [f.getpixel((0, y)), f.getpixel((w_ - 1, y))]
    if any(not is_bg(c) for c in edge):
        bad += 1

# composition fill: fraction of non-background pixels (sampled frames)
coverages = []
for f in frames[::12]:
    small = f.resize((400, 125))
    px = list(small.getdata())
    coverages.append(sum(1 for c in px if not is_bg(c, 10)) / len(px))

print(f"size: {w}x{h}  OK={(w, h) == (1600, 500)}")
print(f"frames: {n}  duration: {dur}ms  loop: {loop}")
print(f"file: {size_kb:.0f} KB")
print(f"loop seam diff last->first: {seam:.3f}  avg consecutive: {avg:.3f}  "
      f"OK={seam <= avg * 2.5}")
print(f"frames with border pixels: {bad}  OK={bad == 0}")
print(f"content coverage (sampled): "
      f"{min(coverages):.1%}..{max(coverages):.1%}  OK={min(coverages) > 0.08}")
