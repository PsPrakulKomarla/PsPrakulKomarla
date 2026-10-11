#!/usr/bin/env python
"""3D Cinematic GitHub Hero - simplified working version"""
import math, os, random
from PIL import Image, ImageDraw

WIDTH, HEIGHT = 1600, 500
FRAME_COUNT = 96
FRAME_DELAY = 1000 / 12
BG = (10, 10, 20)
CORE = (0, 255, 255)
TEAL = (0, 180, 215)
VIO = (150, 50, 200)
WHITE = (255, 255, 255)
NDIR = (255, 255, 200)
DARKB = (0, 200, 255)
SYSB = (180, 80, 250)
OUTDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
SEQDIR = os.path.join(OUTDIR, "frame_seq")
GIFPATH = os.path.join(OUTDIR, "hero.gif")
PNGPATH = os.path.join(OUTDIR, "hero.png")

os.makedirs(OUTDIR, exist_ok=True)
os.makedirs(SEQDIR, exist_ok=True)

print(f"Generating {FRAME_COUNT} frames at 12fps...")

frames = []

for fc in range(FRAME_COUNT):
    t = fc / FRAME_COUNT
    time = fc * FRAME_DELAY / 1000
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    cx, cy = WIDTH // 2, HEIGHT // 2
    
    # 3D rotation angles (slow orbit)
    rx = math.sin(t * 0.3) * 0.5
    ry = math.cos(t * 0.4) * 0.5
    
    # Core pulse
    pulse = math.sin(time * 2.5) * 0.15 + 0.9
    br = int(50 * pulse)
    
    # Core
    for r in range(br, 0, -3):
        a = int(6 * (r / br))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r],
                     fill=(*CORE, a))
    
    ir = int(br * 0.5)
    draw.ellipse([cx - ir - 4, cy - ir - 5, cx + ir + 5, cy + ir + 5],
                 fill=(*CORE, 6))
    
    for dm in [1.0, 0.7, 0.4]:
        dr2 = int(6 * pulse * dm)
        draw.ellipse([cx - dr2, cy - dr2, cx + dr2, cy + dr2],
                     fill=(*WHITE, 3 if dm == 1.0 else 2))
    
    hr = int(3 * pulse)
    draw.ellipse([cx - hr, cy - hr//2, cx, cy + hr//2],
                 fill=(*WHITE, 8))
    
    # Orbital rings with 3D perspective
    for ri in range(6):
        a = (ri / 6) * math.pi * 2 + time * 0.1
        br2 = 35 + ri * 10
        df = 1.0 - (ri * 0.1)
        ar = int(br2 * df)
        th = 2 + ri % 3
        
        if ri < 2: rc = CORE
        elif ri < 4: rc = TEAL
        else: rc = VIO
        
        # 3D position: z-depth increases with ring index
        z = ri * 1.5
        # Orbit radius in XY plane
        orbit_r = br2
        # Height in XY plane
        h = orbit_r * 0.3
        
        # 3D coordinates based on angle
        x3d = orbit_r * math.cos(a)
        y3d = orbit_r * math.sin(a) * 0.6 + h
        z3d = z
        
        # Perspective projection
        focal = 120
        px = cx + int(x3d * focal / (z3d + 1))
        py = cy + int(y3d * focal / (z3d + 1))
        
        # Depth-based scaling
        scale = 1.0 / (z3d + 1)
        dr2 = int(ar * scale)
        ir2 = max(2, dr2 - th)
        or2 = int(dr2 * 1.2 + th)
        
        ca, sx, sy = px, px + or2, py - or2  # reuse px, py
        sa = py
        
        # Ring outline with alpha layers
        for rw in range(th, 0, -1):
            alpha = int(12 * (rw / th))
            draw.ellipse([ca - or2 - rw, sa - or2 - rw, ca + or2 + rw, sa + or2 + rw],
                         fill=(*rc, alpha))
        
        # Inner donut
        for rw in range(ir2, 0, -1):
            alpha = int(15 * (rw / max(ir2, 1)))
            draw.ellipse([ca - rw, sa - rw, ca + rw, sa + rw],
                         fill=(*BG, alpha))
        
        if ri % 2 == 0:
            na = a + math.pi / 4
            # Projected inner node position
            nx = ca + math.cos(na) * (ar + 3) * scale
            ny = sa + math.sin(na) * (ar + 3) * scale
            ns = max(1, int(2 * scale))
            draw.ellipse([nx - ns, ny - ns, nx + ns, ny + ns], fill=(*WHITE, 200))
    
    # System nodes with 3D perspective
    node_cols = [CORE, TEAL, VIO, NDIR, DARKB, SYSB]
    
    # 3D rotation for nodes
    node_rot = time * 0.05
    
    for ni in range(6):
        na = (ni / 6) * math.pi * 2 - time * 0.01
        
        # 3D position for each node at different heights
        z_node = ni * 0.8
        height = (ni - 2) * 1.5
        
        # 3D coordinates
        x3d = math.cos(na) * (50 + ni * 6)
        y3d = (math.sin(na) * (50 + ni * 6) + height) * 0.7
        
        # Perspective projection
        focal = 100
        px = cx + int(x3d * focal / (z_node + 1))
        py = cy + int(y3d * focal / (z_node + 1))
        
        # Depth-based scaling
        scale = 1.0 / (z_node + 1)
        bs = int(3 + ni * 1 * scale)
        nc = node_cols[ni] if ni < len(node_cols) else WHITE
        
        if ni == 0:  # AGENTS
            s = bs
            draw.rectangle([px - s, py - s, px + s, py + s], fill=(*nc, 25))
            draw.rectangle([px - s//1.3, py - s//1.3, px + s//1.3, py + s//1.3], fill=(*nc, 12))
            draw.ellipse([px - 1, py - 1, px + 1, py + 1], fill=WHITE)
        elif ni == 1:  # VISION
            sz = bs
            dp = [(px, py - sz), (px + sz, py), (px, py + sz), (px - sz, py)]
            draw.polygon(dp, fill=(*nc, 20))
            draw.ellipse([px - 1, py - 1, px + 1, py + 1], fill=WHITE)
        elif ni == 2:  # VOICE
            for si in range(2):
                sr = int(bs * 0.3 * (si + 1))
                draw.ellipse([px - sr, py - sr, px + sr, py + sr], fill=(*nc, 8 + si * 4))
            draw.ellipse([px - 1, py - 1, px + 1, py + 1], fill=WHITE)
        elif ni == 3:  # CODE
            for i in range(3):
                sz2 = int(bs * 0.2 * (i + 1))
                draw.rectangle([px - sz2, py - sz2, px + sz2, py + sz2], fill=WHITE, width=1)
            draw.ellipse([px - 1, py - 1, px + 1, py + 1], fill=WHITE)
        elif ni == 4:  # DATA
            for lay in range(2):
                bh = 2
                by = int(-bs * 0.3 + lay * bs * 0.7)
                draw.rectangle([px - bs*0.2, py + by, px + bs*0.2, py + by + bh], fill=(*nc, 6))
            for m in range(2):
                mx = px + int(math.sin(m * math.pi) * bs * 0.2 * scale)
                my = py + int(math.cos(m * math.pi * 2 / 3) * bs * 0.2 * scale)
                draw.ellipse([mx - 1, my - 1, mx + 1, my + 1], fill=WHITE)
        elif ni == 5:  # SYSTEMS
            draw.rectangle([px - bs*0.1, py + bs*0.1, px + bs*0.1, py + bs*0.4], fill=(*nc, 8))
            for wi in range(3):
                wx = px - bs * 0.1 + wi * bs * 0.15 * scale
                draw.rectangle([wx, py - bs * 0.1 * scale, wx + 1, py + bs * 0.1 * scale], fill=(*WHITE, 5))
    
    # Particle field - 3 layers
    pcount = 40
    fgc = pcount // 3
    mdc = pcount // 3
    bgc = pcount - fgc - mdc
    
    random.seed(int(time * 150) + fc)
    
    for i in range(fgc):
        px = cx + random.randint(-50, 60)
        py = cy + random.randint(-30, 30)
        sz = random.randint(1, 2)
        bri = random.randint(140, 220)
        draw.ellipse([px - sz, py - sz, px + sz, py + sz], fill=(*WHITE, bri))
    
    for i in range(mdc):
        px = cx + random.randint(-80, 80)
        py = cy + random.randint(-50, 50)
        sz = random.randint(1, 1)
        bri = random.randint(80, 130)
        draw.ellipse([px - sz, py - sz, px + sz, py + sz], fill=(*WHITE, bri))
    
    for i in range(bgc):
        px = cx + random.randint(-110, 110)
        py = cy + random.randint(-60, 60)
        sz = random.randint(0, 1)
        bri = random.randint(30, 60)
        draw.ellipse([px - sz, py - sz, px + sz, py + sz], fill=(*WHITE, bri))
    
    # HUD labels
    for li in range(6):
        la = (li / 6) * math.pi * 2 - time * 0.003
        ld = 40 + li * 4
        lx = cx + int(math.cos(la) * ld)
        ly = cy + int(math.sin(la) * ld) - 10
        sz = 2 + abs(li - 2)
        a = 150
        draw.ellipse([lx - sz, ly - sz, lx + sz, ly + sz], fill=(*node_cols[li], a))
    
    frames.append(img)
    img.save(os.path.join(SEQDIR, f"f_{fc:03d}.png"), optimize=True)
    print(f"  Frame {fc + 1}/{FRAME_COUNT}", end='\r')

print(f"\nGenerated {len(frames)} frames")

# Ensure all frames are RGB mode for consistent GIF output
frames = [f.convert('RGB') for f in frames]

if frames:
    frames[0].save(GIFPATH, save_all=True, append_images=frames[1:],
                   duration=FRAME_DELAY, loop=0, optimize=True)
    print(f"GIF: {GIFPATH}")
    try:
        from PIL import Image as Im
        vi = Im.open(GIFPATH)
        nf = getattr(vi, 'n_frames', 1)
        print(f"Verify: mode={vi.mode}, size={vi.size}, frames={nf}")
    except Exception as e:
        print(f"Verify: {e}")

if frames:
    # Convert back to RGBA for PNG if needed, or keep RGB
    rgb_frames = [f.convert('RGBA') if f.mode != 'RGBA' else f for f in frames]
    frames[0].save(PNGPATH, optimize=True)
    print(f"PNG: {PNGPATH}")

print("\n=== DONE ===")