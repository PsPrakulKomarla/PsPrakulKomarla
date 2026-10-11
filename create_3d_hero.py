#!/usr/bin/env python
"""3D cinematic GitHub profile hero - 1600x500, ~8s seamless loop, ~12fps.

Rendering model:
  * Every animated quantity is periodic in the loop (phase = 2*pi*frame/N),
    so the last frame wraps cleanly into the first.
  * Rings are true 3D circles (tilted planes + perspective projection) with
    depth-shaded segments: back halves are drawn before the core, front halves
    after it, giving real occlusion.
  * The composition spans the full banner: 4 orbital rings, 6 labeled system
    nodes on a wide orbit, drifting particles across the whole canvas.
Dependencies: Pillow only.
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1600, 500
CX, CY = WIDTH // 2, HEIGHT // 2

FRAME_COUNT = 96
FRAME_MS = 83             # GIF stores this as 80ms (1/100s granularity)
LOOP = 2.0 * math.pi

BG = (10, 10, 20)
CYAN = (0, 245, 255)
TEAL = (0, 210, 190)
VIOLET = (175, 95, 255)
BLUE = (0, 190, 255)
WARM = (255, 240, 190)
WHITE = (255, 255, 255)
LABEL = (215, 235, 250)

FOCAL = 900.0

OUTDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
GIFPATH = os.path.join(OUTDIR, "hero.gif")

NODES = [
    ("AGENTS",   0, CYAN,   "hex"),
    ("VISION",  60, TEAL,   "diamond"),
    ("VOICE",  120, VIOLET, "waves"),
    ("CODE",   180, WARM,   "brackets"),
    ("DATA",   240, BLUE,   "bars"),
    ("SYSTEMS",300, VIOLET, "ticks"),
]
ORBIT_RX, ORBIT_RY = 560, 168

RINGS = [
    (300, 72,   0, CYAN,   150, 7,  1, 0.0),
    (255, 58,  28, TEAL,   120, 9,  2, 2.1),
    (340, 64, -24, VIOLET, 110, 8, -1, 4.2),
    (205, 78,  12, BLUE,    80, 6,  1, 5.3),
]


def load_font(size):
    for name in ("seguisb.ttf", "arialbd.ttf", "segoeui.ttf", "arial.ttf"):
        path = os.path.join("C:/Windows/Fonts", name)
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size=size)


def draw_spaced(draw, xy, text, font, fill, spacing=2, anchor="mm"):
    """Draw letter-spaced text (PIL has no tracking support)."""
    adv = [font.getlength(ch) for ch in text]
    total = sum(adv) + spacing * (len(text) - 1)
    x, y = xy
    if anchor[0] == "m":
        x -= total / 2
    elif anchor[0] == "r":
        x -= total
    if anchor[1] == "m":
        y -= (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) / 2
    for ch, w in zip(text, adv):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + spacing


def ring_point(radius, tilt_x, tilt_z, t):
    x, y = radius * math.cos(t), radius * math.sin(t)
    cx_, sx_ = math.cos(tilt_x), math.sin(tilt_x)
    y1, z1 = y * cx_, y * sx_                 # rotX
    cz_, sz_ = math.cos(tilt_z), math.sin(tilt_z)
    x2 = x * cz_ - y1 * sz_
    y2 = x * sz_ + y1 * cz_                   # rotZ
    return x2, y2, z1


def project(x, y, z):
    s = FOCAL / (FOCAL - z)
    return CX + x * s, CY + y * s, s


def edge_fade(x, y, span=30):
    """Alpha multiplier that fades drawing out near the canvas border so
    oversized ring arcs never hard-clip against an edge."""
    m = min(x, WIDTH - 1 - x, y, HEIGHT - 1 - y)
    return max(0.0, min(1.0, (m - 4) / span))



def build_background():
    """Static background: soft radial lift + fixed star field (no flicker)."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    ov = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for r, a in ((430, 9), (330, 10), (230, 12), (150, 14)):
        d.ellipse([CX - int(r * 1.9), CY - r, CX + int(r * 1.9), CY + r],
                  fill=(30, 90, 130, a))
    img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")

    d = ImageDraw.Draw(img)
    rnd = random.Random(7)
    for _ in range(150):
        x = rnd.randint(24, WIDTH - 24)
        y = rnd.randint(24, HEIGHT - 24)
        a = rnd.randint(25, 70)
        if abs(x - CX) < 130 and abs(y - CY) < 130:
            continue
        c = (a, a + rnd.randint(0, 25), min(255, a + rnd.randint(10, 50)))
        d.point((x, y), fill=c)
    return img


def draw_core(d, pulse):
    # stepped radial glow (drawn outer->inner on an overlay; each smaller
    # circle replaces the alpha inside it, producing a smooth ramp when the
    # overlay is alpha_composited onto the background)
    for i in range(14, 0, -1):
        rr = (46 + i * 9) * pulse
        a = int(58 * (1 - i / 15) ** 1.6) + 4
        d.ellipse([CX - rr, CY - rr, CX + rr, CY + rr], fill=(*CYAN, a))
    r = 42 * pulse
    d.ellipse([CX - r, CY - r, CX + r, CY + r], fill=(*CYAN, 255))
    ir = r * 0.62
    d.ellipse([CX - ir, CY - ir, CX + ir, CY + ir], fill=(150, 255, 255, 255))
    hr = r * 0.3
    d.ellipse([CX - hr, CY - hr, CX + hr, CY + hr], fill=(*WHITE, 255))
    hx, hy = CX - r * 0.35, CY - r * 0.4
    hr2 = r * 0.18
    d.ellipse([hx - hr2, hy - hr2, hx + hr2, hy + hr2], fill=(*WHITE, 170))


def draw_hex_shell(d, phase):
    """Slowly counter-rotating hexagon wireframes around the core."""
    for radius, dirn, color, alpha, width in (
        (86, 1, CYAN, 95, 2), (62, -1, VIOLET, 85, 2)
    ):
        pts = []
        for i in range(6):
            a = phase * dirn + i * LOOP / 6
            pts.append((CX + radius * math.cos(a),
                        CY + radius * math.sin(a) * 0.85))
        d.polygon(pts, outline=(*color, alpha), width=width)


def ring_segments(tilt_x, tilt_z, radius):
    """Projected ring segments with per-segment depth."""
    n = 108
    segs = []
    prev = None
    for i in range(n + 1):
        t = i * LOOP / n
        x, y, z = ring_point(radius, tilt_x, tilt_z, t)
        px, py, _ = project(x, y, z)
        if prev is not None:
            zm = (z + prev[2]) / 2
            depth = (zm + radius) / (2 * radius)      # 0 back .. 1 front
            segs.append((depth, (prev[0], prev[1], px, py)))
        prev = (px, py, z)
    return segs


def draw_ring(d, segs, color, base_alpha, front):
    for depth, (x1, y1, x2, y2) in segs:
        if (depth > 0.5) != front:
            continue
        alpha = int(base_alpha * (0.22 + 0.78 * depth)
                    * edge_fade((x1 + x2) / 2, (y1 + y2) / 2))
        if alpha < 3:
            continue
        width = 2 if depth > 0.62 else 1
        d.line([x1, y1, x2, y2], fill=(*color, alpha), width=width)


def draw_satellite(d, tilt_x, tilt_z, radius, t, color):
    x, y, z = ring_point(radius, tilt_x, tilt_z, t)
    px, py, s = project(x, y, z)
    fade = edge_fade(px, py)
    if fade <= 0:
        return
    depth = (z + radius) / (2 * radius)
    r = max(2, int(4 * s * (0.55 + 0.45 * depth)))
    a = int((120 + 120 * depth) * fade)
    d.ellipse([px - r * 2.4, py - r * 2.4, px + r * 2.4, py + r * 2.4],
              fill=(*color, a // 4))
    d.ellipse([px - r, py - r, px + r, py + r], fill=(*color, a))
    d.ellipse([px - r / 2.4, py - r / 2.4, px + r / 2.4, py + r / 2.4],
              fill=(*WHITE, a))


def node_marker(d, px, py, color, kind, pulse):
    s = 11 * pulse
    a_fill, a_line = 70, 230
    d.ellipse([px - s * 2.1, py - s * 2.1, px + s * 2.1, py + s * 2.1],
              fill=(*color, 28))
    if kind == "hex":
        pts = [(px + s * math.cos(i * LOOP / 6),
                py + s * math.sin(i * LOOP / 6)) for i in range(6)]
        d.polygon(pts, fill=(*color, a_fill), outline=(*color, a_line), width=2)
    elif kind == "diamond":
        pts = [(px, py - s), (px + s, py), (px, py + s), (px - s, py)]
        d.polygon(pts, fill=(*color, a_fill), outline=(*color, a_line), width=2)
    elif kind == "waves":
        for k in (1.0, 0.62, 0.28):
            rr = s * k
            d.ellipse([px - rr, py - rr, px + rr, py + rr],
                      outline=(*color, a_line), width=2)
    elif kind == "brackets":
        d.line([px + s * 0.4, py - s, px - s * 0.6, py - s], fill=(*color, a_line), width=2)
        d.line([px - s * 0.6, py - s, px - s * 0.6, py + s], fill=(*color, a_line), width=2)
        d.line([px - s * 0.6, py + s, px + s * 0.4, py + s], fill=(*color, a_line), width=2)
        d.line([px - s * 0.2, py - s * 0.5, px - s * 0.2, py + s * 0.5], fill=(*color, a_line), width=2)
        d.line([px + s * 0.3, py - s * 0.5, px + s * 0.3, py + s * 0.5], fill=(*color, a_line), width=2)
    elif kind == "bars":
        for k in (-0.55, 0.0, 0.55):
            d.line([px - s * 0.8, py + s * k, px + s * 0.8, py + s * k],
                   fill=(*color, a_line), width=2)
    elif kind == "ticks":
        d.ellipse([px - s * 0.7, py - s * 0.7, px + s * 0.7, py + s * 0.7],
                  outline=(*color, a_line), width=2)
        for i in range(4):
            a = i * LOOP / 4
            d.line([px + s * 0.9 * math.cos(a), py + s * 0.9 * math.sin(a),
                    px + s * 1.25 * math.cos(a), py + s * 1.25 * math.sin(a)],
                   fill=(*color, a_line), width=2)
    d.ellipse([px - 2, py - 2, px + 2, py + 2], fill=(*WHITE, 255))



def render_frame(fc, bg, font):
    phase = LOOP * fc / FRAME_COUNT
    pulse = 1.0 + 0.055 * math.sin(phase * 2)

    # three composited stages so alpha blending works between layers
    # (backdrop: pulses, ring back-halves, hex shell, core)
    ov = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)

    # expanding energy pulses (alpha reaches 0 at reset -> seamless)
    for off in (0, FRAME_COUNT // 4):
        fr = ((fc + off) % (FRAME_COUNT // 2)) / (FRAME_COUNT // 2)
        rr = 62 + 190 * fr
        a = int(60 * math.sin(fr * math.pi))
        if a > 2:
            d.ellipse([CX - rr, CY - rr * 0.92, CX + rr, CY + rr * 0.92],
                      outline=(*CYAN, a), width=2)

    # rings: back halves -> core -> front halves (depth occlusion)
    ring_data = []
    for radius, tx, tz, color, alpha, prec, sspeed, sphase in RINGS:
        txr = math.radians(tx + prec * math.sin(phase))
        tzr = math.radians(tz)
        segs = ring_segments(txr, tzr, radius)
        ring_data.append((segs, txr, tzr, radius, color, alpha, sspeed, sphase))
        draw_ring(d, segs, color, alpha, front=False)

    draw_hex_shell(d, phase)
    draw_core(d, pulse)
    img = Image.alpha_composite(bg.convert("RGBA"), ov)

    # foreground stage: ring front-halves + satellites
    ov = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for segs, txr, tzr, radius, color, alpha, sspeed, sphase in ring_data:
        draw_ring(d, segs, color, alpha, front=True)
        for k in (0, 1):
            t = phase * sspeed + sphase + k * LOOP / 2
            draw_satellite(d, txr, tzr, radius, t, color)
    img = Image.alpha_composite(img, ov)

    # top stage: nodes, connectors, labels, particles
    ov = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)

    # system nodes on a wide ellipse + connectors + traveling pulses
    label_shift = 30
    for i, (label, ang, color, marker) in enumerate(NODES):
        a = math.radians(ang)
        bob = 7 * math.sin(phase + i * LOOP / 6)
        px = CX + ORBIT_RX * math.cos(a)
        py = CY + ORBIT_RY * math.sin(a) + bob
        npulse = 1.0 + 0.1 * math.sin(phase * 2 + i)

        dx, dy = px - CX, py - CY
        dist = math.hypot(dx, dy)
        ux, uy = dx / dist, dy / dist
        x1, y1 = CX + ux * 150, CY + uy * 150
        x2, y2 = px - ux * 26, py - uy * 26
        d.line([x1, y1, x2, y2], fill=(*color, 42), width=1)
        # pulse traveling outward (integer frequency -> seamless)
        fr = (2.0 * fc / FRAME_COUNT + i / 6) % 1.0
        ppx, ppy = x1 + (x2 - x1) * fr, y1 + (y2 - y1) * fr
        fade = math.sin(fr * math.pi)
        d.ellipse([ppx - 2.6, ppy - 2.6, ppx + 2.6, ppy + 2.6],
                  fill=(*color, int(170 * fade)))

        node_marker(d, px, py, color, marker, npulse)

        ly = py - label_shift if math.sin(a) > -0.1 else py + label_shift
        draw_spaced(d, (px, ly), label, font, (*LABEL, 245), spacing=3)

    # drifting particles across the full banner
    rnd = random.Random(21)
    for _ in range(85):
        bx = rnd.randint(26, WIDTH - 26)
        by = rnd.randint(26, HEIGHT - 26)
        amp = rnd.uniform(8, 26)
        spd = rnd.choice((1, 1, 2))              # integer -> seamless
        poff = rnd.uniform(0, LOOP)
        size = rnd.choice((1, 1, 2))
        base_a = rnd.randint(35, 115)
        x = bx + amp * math.sin(phase * spd + poff)
        y = by + amp * 0.55 * math.cos(phase * spd + poff * 1.7)
        a = int(base_a * (0.6 + 0.4 * math.sin(phase * 2 + poff)))
        if a <= 6:
            continue
        tint = rnd.choice((WHITE, CYAN, TEAL, VIOLET))
        d.ellipse([x - size, y - size, x + size, y + size], fill=(*tint, a))

    return Image.alpha_composite(img, ov).convert("RGB")


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    print(f"Generating {FRAME_COUNT} frames at {WIDTH}x{HEIGHT} ...")
    bg = build_background()
    font = load_font(24)
    frames = [render_frame(fc, bg, font) for fc in range(FRAME_COUNT)]
    print(f"Rendered {len(frames)} frames")

    # shared adaptive palette -> no palette flicker, better compression
    samples = [frames[0], frames[24], frames[48], frames[72]]
    mont = Image.new("RGB", (WIDTH // 2, (HEIGHT // 2) * 4))
    for i, s in enumerate(samples):
        mont.paste(s.resize((WIDTH // 2, HEIGHT // 2)), (0, (HEIGHT // 2) * i))
    pal = mont.quantize(colors=128, method=Image.MEDIANCUT)

    qframes = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    qframes[0].save(
        GIFPATH, save_all=True, append_images=qframes[1:],
        duration=FRAME_MS, loop=0, optimize=True,
    )
    size_kb = os.path.getsize(GIFPATH) / 1024
    print(f"GIF: {GIFPATH}  ({size_kb:.0f} KB)")

    with Image.open(GIFPATH) as vi:
        print(f"Verify: size={vi.size} frames={vi.n_frames} "
              f"duration={vi.info.get('duration')}ms loop={vi.info.get('loop')}")
    print("=== DONE ===")


if __name__ == "__main__":
    main()

