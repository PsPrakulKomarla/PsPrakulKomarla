#!/usr/bin/env python
"""Create animated hero banner and static fallback for GitHub profile."""

import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Target size for GitHub hero banner
width, height = 1600, 500

# Color scheme: near-black background, electric cyan/teal/violet accents, white/gray text
bg_color = (10, 10, 20)  # near-black
core_color = (0, 255, 255)  # electric cyan
node_color = (0, 180, 215)  # teal
accent_color = (150, 50, 200)  # violet
text_color = (255, 255, 255)  # white

assets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
os.makedirs(assets_dir, exist_ok=True)

# Create frames for animation
frame_count = 12  # 12 frames for smooth loop
frame_duration = 0.1  # seconds per frame

frames = []

try:
    # Try to use a truetype font, fall back to default
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 40)
        font_available = True
    except:
        font = ImageFont.load_default()
        font_available = False
    
    for frame in range(frame_count):
        img = Image.new('RGB', (width, height), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Central pulsing core
        pulse = np.sin(frame * np.pi / 6) * 0.1 + 1.0
        core_x, core_y = width // 2, height // 2
        core_radius = int(70 * pulse)
        
        # Draw central core glow
        for r in range(core_radius, 0, -3):
            alpha = int(30 * (r / core_radius))
            draw.ellipse(
                [core_x - r, core_y - r, core_x + r, core_y + r],
                fill=(*core_color, alpha) if alpha > 0 else None
            )
        
        # Draw central core
        draw.ellipse(
            [core_x - core_radius + 5, core_y - core_radius + 5,
             core_x + core_radius - 5, core_y + core_radius - 5],
            fill=bg_color  # core hole
        )
        draw.ellipse(
            [core_x - core_radius, core_y - core_radius,
             core_x + core_radius, core_y + core_radius],
            fill=(*core_color, 30)  # subtle core fill
        )
        
        # 6 orbiting agent nodes
        for i in range(6):
            node_angle = (frame * np.pi / 6 + i * np.pi / 3) % (2 * np.pi)
            node_dist = 130 + 20 * np.sin(frame * np.pi / 3 + i * 2)
            node_x = core_x + int(node_dist * np.cos(node_angle))
            node_y = core_y + int(node_dist * np.sin(node_angle))
            
            node_size = int(12 + 4 * np.cos(frame * np.pi / 3 + i * 2))
            draw.ellipse(
                [node_x - node_size, node_y - node_size,
                 node_x + node_size, node_y + node_size],
                fill=node_color
            )
        
        # 3 orbital rings
        for ring in range(3):
            r = 180 + ring * 40 + 10 * np.sin(frame * np.pi / 6)
            draw.ellipse(
                [core_x - r, core_y - r, core_x + r, core_y + r],
                outline=(*accent_color, 40 + ring * 20),
                width=1
            )
        
        # Data particles (5 small drifting dots)
        for i in range(5):
            px = int(width * 0.3 + 150 * np.sin(frame * np.pi / 4 + i))
            py = int(height * 0.4 + 100 * np.cos(frame * np.pi / 3 + i))
            draw.rectangle(
                [px - 2, py - 2, px + 2, py + 2],
                fill=text_color
            )
        
        # HUD indicators - 4 subtle lights
        for i in range(4):
            angle = frame * np.pi / 4 + i * np.pi / 2
            hx = core_x + int(60 * np.cos(angle))
            hy = core_y + int(60 * np.sin(angle))
            size = 3 + np.sin(frame * np.pi / 2 + i) * 2
            draw.ellipse(
                [hx - size, hy - size, hx + size, hy + size],
                fill=(*accent_color, 200)
            )
        
        # Labels: "AI" and "SYSTEMS" at bottom
        if font_available:
            label_x = core_x - 60
            label_y = core_y + 160
            draw.text((label_x, label_y), "AI", fill=text_color, font=font)
            label_x2 = core_x + 80
            draw.text((label_x2, label_y), "SYSTEMS", fill=accent_color, font=font)
        
        frames.append(img)
        print(f"Created frame {frame + 1}/{frame_count}")
    
    # Save as animated GIF
    gif_path = os.path.join(assets_dir, 'hero.gif')
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(frame_duration * 1000),  # milliseconds
        loop=0,  # infinite loop
        optimize=True
    )
    print(f"\nSaved: {gif_path}")
    
    # Verify the GIF
    verify_img = Image.open(gif_path)
    print(f"\nGIF verification:")
    print(f"  Mode: {verify_img.mode}")
    print(f"  Size: {verify_img.size}")
    print(f"  Frame count: {getattr(verify_img, 'n_frames', 1)}")
    
    # Test each frame
    if hasattr(verify_img, 'n_frames') and verify_img.n_frames and verify_img.n_frames > 1:
        for i in range(min(verify_img.n_frames, 3)):
            verify_img.seek(i)
            print(f"  Frame {i}: size={verify_img.size}, mode={verify_img.mode}")
    else:
        print("  (Single frame GIF - will display first frame)")
    
    print("\n=== ASSETS CREATION COMPLETE ===")
    
except Exception as e:
    print(f"Error creating assets: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)