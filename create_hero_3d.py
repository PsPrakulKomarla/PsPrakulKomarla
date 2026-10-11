#!/usr/bin/env python
"""3D Cinematic GitHub Hero Banner Generator"""
import math, os, random
from PIL import Image, ImageDraw

WIDTH, HEIGHT = 1600, 500
FRAME_COUNT = 96
FRAME_DELAY = 1000 / 12
BG_COLOR = (10, 10, 20)
CORE_COLOR = (0, 255, 255)
TEAL_COLOR = (0, 180, 215)
VIOLET_COLOR = (150, 50, 200)
WHITE_COLOR = (255, 255, 255)
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
SEQ_DIR = os.path.join(OUTPUT_DIR, "frame_seq")
OUTPUT_GIF = os.path.join(OUTPUT_DIR, "hero.gif")
OUTPUT_PNG = os.path.join(OUTPUT_DIR, "hero.png")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(SEQ_DIR, exist_ok=True)

def dc(c, a=255):
    """Draw color with alpha"""
    return (*c, min(a, 255))

def dr(d, c, x1, y1, x2, y2, w=1):
    """Draw line using polygon"""
    dx, dy = x2-x1, y2-y1
    lv = max(math.hypot(dx, dy), 1)
    an = math.atan2(dy, dx)
    ox = -math.sin(an) * w/2
    oy = math.cos(an) * w/2
    p = [(x1+ox, y1+oy), (x2+ox, y2+oy), (x2-ox, y2-oy), (x1-ox, y1-oy)]
    d.polygon(p, fill=c)

print(f"Generating {FRAME_COUNT} frames...")

frames = []

for fc in range(FRAME_COUNT):
    t = fc / FRAME_COUNT
    time = fc * FRAME_DELAY / 1000
    
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    ccx, ccy = WIDTH // 2, HEIGHT // 2
    
    pulse = math.sin(time * 2.5) * 0.15 + 0.9
    br = int(55 * pulse)
    
    # Core
    for r in range(br, 0, -3):
        a = int(12 * (r / br))
        draw.ellipse([ccx - r, ccy - r, ccx + r, ccy + r],
                     fill=(*CORE_COLOR, a))
    
    ir = int(br * 0.6)
    draw.ellipse([ccx - ir - 5, ccy - ir - 5,
                  ccx + ir + 5, ccy + ir + 5],
                 fill=(*CORE_COLOR, 12))
    
    for dm in [1.0, 0.8, 0.6]:
        dr2 = int(14 * pulse * dm)
        draw.ellipse([ccx - dr2, ccy - dr2, ccx + dr2, ccy + dr2],
                     fill=(*WHITE_COLOR, 8 if dm == 1.0 else 6))
    
    hr = int(5 * pulse)
    draw.ellipse([ccx - hr, ccy - hr//2, ccx, ccy + hr//2],
                 fill=(*WHITE_COLOR, 25))
    
    # Orbital rings
    for ri in range(6):
        a = (ri / 6) * math.pi * 2 + time * 0.15
        br2 = 55 + ri * 16
        df = 1.0 - (ri * 0.12)
        ar = int(br2 * df)
        th = 2 + ri % 3
        
        if ri < 2: rc = CORE_COLOR
        elif ri < 4: rc = TEAL_COLOR
        else: rc = VIOLET_COLOR
        
        ps = 1.0 / (1.0 + ri * 0.13)
        dr2 = int(ar * ps)
        ir2 = dr2 - th
        or2 = dr2 + th
        
        ca = math.cos(a) * br2 + ccx
        sa = math.sin(a) * br2 + ccy
        
        draw.ellipse([ca - or2, sa - or2, ca + or2, sa + or2],
                     outline=rc, width=th)
        if ir2 > 3:
            draw.ellipse([ca - ir2, sa - ir2, ca + ir2, sa + ir2], fill=BG_COLOR)
        
        if ri % 2 == 0:
            na = a + math.pi / 4
            nx = ca + math.cos(na) * (ar2 + 5)
            ny = sa + math.sin(na) * (ar2 + 5)
            ns = 2 + ri % 3
            draw.ellipse([nx - ns, ny - ns, nx + ns, ny + ns], fill=WHITE_COLOR)
    
    # System nodes
    node_labels = ["AGENTS", "VISION", "VOICE", "CODE", "DATA", "SYSTEMS"]
    node_cols = [CORE_COLOR, TEAL_COLOR, VIOLET_COLOR, (255,255,200), (0,200,255), (180,80,250)]
    
    for ni in range(6):
        na = (ni / 6) * math.pi * 2 - time * 0.03
        dc_val = 100 + ni * 14
        zd = (ni - 2) * 8
        df = 1.0 - (abs(zd) / 100)
        sf = 1.2 + df * 0.4
        
        px = ccx + int(math.cos(na) * dc_val)
        py = ccy + int(math.sin(na) * dc_val) + (ni - 2) * 5
        
        bs = 6 + int(4 * sf)
        nc = node_cols[ni]
        
        if ni == 0:  # AGENTS
            s = bs
            draw_box = [px - s, py - s, px + s, py + s]
            draw.rectangle(draw_box, fill=(*nc, 45))
            draw_box2 = [px - s//2 - 3, py - s//2 - 3,
                        px + s//2 + 3, py + s//2 + 3]
            draw.rectangle(draw_box2, fill=(*nc, 25))
            dr_line = [px - s, py, px - s//2 - 3, py - s//2 - 3]
            dr_line2 = [px + s, py, px + s//2 + 3, py + s//2 + 3]
            dr(draw, dr_line, WHITE_COLOR, 1)
            dr(draw, dr_line2, WHITE_COLOR, 1)
            dc(WHITE_COLOR, 3)  # circle
            # Actually need to use draw.ellipse
            draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=WHITE_COLOR)
            
        elif ni == 1:  # VISION
            bs_val = bs
            # Diamond
            dp = [(px, py - bs_val), (px + bs_val, py),
                 (px, py + bs_val), (px - bs_val, py)]
            draw.polygon(dp, fill=(*nc, 35))
            # edges
            dr(dc=dc(WHITE_COLOR), x1=dp[0][0], y1=dp[0][1],
               x2=dp[1][0], y2=dp[1][1], w=1)
            dr(dc=dc(WHITE_COLOR), x1=dp[1][0], y1=dp[1][1],
               x2=dp[2][0], y2=dp[2][1], w=1)
            dr(dc=dc(WHITE_COLOR), x1=dp[2][0], y1=dp[2][1],
               x2=dp[3][0], y2=dp[3][1], w=1)
            dr(dc=dc(WHITE_COLOR), x1=dp[3][0], y1=dp[3][1],
               x2=dp[0][0], y2=dp[0][1], w=1)
            dc(WHITE_COLOR, 2)  # circle
            # circle needs different approach
            draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill=WHITE_COLOR)
            
        elif ni == 2:  # VOICE
            for si in range(3):
                sr = int(bs * 0.4 * (si + 1))
                draw_circ = [px - sr, py - sr, px + sr, py + sr]
                draw.ellipse(draw_circ, fill=(*nc, 20 + si * 8))
            dc(WHITE_COLOR, 3)  # circle
            draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=WHITE_COLOR)
            
        elif ni == 3:  # CODE
            for i in range(6):
                ra = i * math.pi / 3 - time * 0.02
                rx = int(math.cos(na) * bs * 0.3)
                ry = int(math.sin(na) * bs * 0.3)
                draw_box = [px + rx - 3, py + ry - 3, px + rx + 3, py + ry + 3]
                draw.rectangle(draw_box, fill=WHITE_COLOR, width=1)
            dc(WHITE_COLOR, 3)
            draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=WHITE_COLOR)
            
        elif ni == 4:  # DATA
            for lay in range(4):
                bh = 3
                by = int(-bs * 0.5 + lay * bs * 1.3)
                draw_box = [px - bs * 0.4, py + by, px + bs * 0.4, py + by + bh]
                draw.rectangle(draw_box, fill=(*nc, 15 + lay * 5))
            for m in range(3):
                mx = px + int(math.sin(m * math.pi) * bs * 0.3)
                my = py + int(math.cos(m * math.pi * 2 / 3) * bs * 0.3)
                dc(WHITE_COLOR, 2)
                draw.ellipse([mx - 2, my - 2, mx + 2, my + 2], fill=WHITE_COLOR)
            
        elif ni == 5:  # SYSTEMS
            draw_box = [px - bs * 0.4, py + bs * 0.2,
                       px + bs * 0.4, py + bs * 1.1]
            draw.rectangle(draw_box, fill=(*nc, 30))
            for wi in range(5):
                wx = px - bs * 0.35 + wi * bs * 0.2
                draw_box2 = [wx - 1, py - bs * 0.2, wx + 1, py + bs * 0.2]
                draw.rectangle(draw_box2, fill=WHITE_COLOR)
    
    # Particle field
    pcount = 100
    fgc = pcount // 3
    mdc = pcount // 3
    bgc = pcount - fgc - mdc
    
    for i in range(fgc):
        px = ccx + random.randint(-120, 120)
        py = ccy + random.randint(-60, 60)
        sz = random.randint(1, 2)
        bri = random.randint(180, 255)
        draw.ellipse([px - sz, py - sz, px + sz, py + sz],
                     fill=(*WHITE_COLOR, bri))
    
    for i in range(mdc):
        px = ccx + random.randint(-150, 150)
        py = ccy + random.randint(-80, 80)
        sz = random.randint(1, 1)
        bri = random.randint(130, 180)
        draw.ellipse([px - sz, py - sz, px + sz, py + sz],
                     fill=(*WHITE_COLOR, bri))
    
    for i in range(bgc):
        px = ccx + random.randint(-180, 180)
        py = ccy + random.randint(-100, 100)
        sz = random.randint(0, 1)
        bri = random.randint(60, 100)
        draw.ellipse([px - sz, py - sz, px + sz, py + sz],
                     fill=(*WHITE_COLOR, bri))
    
    # HUD labels
    hud_labels = ["AGENTS", "VISION", "VOICE", "CODE", "DATA", "SYSTEMS"]
    for li in range(6):
        la = (li / 6) * math.pi * 2 - time * 0.02
        ld = 120 + li * 12
        lx = ccx + int(math.cos(la) * ld)
        ly = ccy + int(math.sin(la) * ld) - 30
        ts = 9 + abs(li - 2) * 1.2
        draw.text([lx - 1, ly - 1], hud_labels[li], fill=(0, 0, 0))
        draw.text([lx, ly], hud_labels[li], fill=(*WHITE_COLOR, 255), size=ts)
    
    frames.append(img)
    img.save(os.path.join(SEQ_DIR, f"f_{fc:03d}.png"),
             optimize=True)
    print(f"  Frame {fc + 1}/{FRAME_COUNT}", end='\r')

print(f"\nGenerated {len(frames)} frames")

# Save PNG fallback
if frames:
    frames[0].save(OUTPUT_PNG, optimize=True)
    print(f"PNG: {OUTPUT_PNG}")

# Save GIF
if frames:
    frames[0].save(OUTPUT_GIF,
                   save_all=True,
                   append_images=frames[1:],
                   duration=FRAME_DELAY,
                   loop=0,
                   optimize=True)
    print(f"GIF: {OUTPUT_GIF}")
    print(f"Frames: {len(frames)}, ~{FRAME_COUNT/12:.1f}s")
    
    # Verify
    try:
        from PIL import Image as Im
        vi = Im.open(OUTPUT_GIF)
        print(f"Verify: mode={vi.mode}, size={vi.size}, frames={getattr(vi, 'n_frames', 1)}")
        if hasattr(vi, 'n_frames') and vi.n_frames and vi.n_frames > 1:
            for i in range(min(vi.n_frames, 3)):
                vi.seek(i)
                print(f"  Frame {i}: {vi.size}")
    except Exception as e:
        print(f"Verify error: {e}")

print("\n=== DONE ===")
print(f"SEQ: {SEQ_DIR}")
print(f"GIF: {OUTPUT_GIF}")
print(f"PNG: {OUTPUT_PNG}")