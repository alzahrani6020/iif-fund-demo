from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

W, H = 1024, 1024
cx, cy = W // 2, H // 2

img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

def hex_to_rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4)) + (alpha,)

# Colors
gold = hex_to_rgba('#D4AF37')
gold_light = hex_to_rgba('#F4E4BC')
gold_dark = hex_to_rgba('#B8960B')
gold_mid = hex_to_rgba('#E5C158')
dark1 = hex_to_rgba('#0A1628')
dark2 = hex_to_rgba('#0d1f35')
dark3 = hex_to_rgba('#061020')

# Background circle with gradient
r_outer = 480
for i in range(r_outer, 0, -2):
    ratio = i / r_outer
    r_val = int(10 * (1-ratio) + 22 * ratio)
    g_val = int(22 * (1-ratio) + 31 * ratio)
    b_val = int(40 * (1-ratio) + 53 * ratio)
    draw.ellipse([cx-i, cy-i, cx+i, cy+i], fill=(r_val, g_val, b_val, 255))

# Outer gold border (3D effect)
for w in range(20, 0, -1):
    ratio = w / 20
    if ratio < 0.25:
        col = gold_light
    elif ratio < 0.5:
        col = gold
    elif ratio < 0.75:
        col = gold_mid
    else:
        col = gold_dark
    draw.ellipse([cx-480-w, cy-480-w, cx+480+w, cy+480+w], outline=col, width=1)

# Inner decorative rings
draw.ellipse([cx-460, cy-460, cx+460, cy+460], outline=(*gold[:3], 100), width=1)
draw.ellipse([cx-420, cy-420, cx+420, cy+420], outline=(*gold[:3], 150), width=2)
draw.ellipse([cx-400, cy-400, cx+400, cy+400], outline=(*gold[:3], 80), width=1)

# Crown - detailed
crown_y = 170
crown_points = [
    (cx-100, crown_y+80), (cx-80, crown_y+20), (cx-60, crown_y+50),
    (cx-30, crown_y), (cx, crown_y+30), (cx+30, crown_y),
    (cx+60, crown_y+50), (cx+80, crown_y+20), (cx+100, crown_y+80),
    (cx+70, crown_y+100), (cx+35, crown_y+80), (cx, crown_y+100),
    (cx-35, crown_y+80), (cx-70, crown_y+100)
]
draw.polygon(crown_points, fill=gold, outline=gold_dark, width=3)
draw.ellipse([cx-12, crown_y-8, cx+12, crown_y+16], fill=gold_light, outline=gold_dark, width=2)
draw.ellipse([cx-72, crown_y+5, cx-48, crown_y+29], fill=gold_light, outline=gold_dark, width=2)
draw.ellipse([cx+48, crown_y+5, cx+72, crown_y+29], fill=gold_light, outline=gold_dark, width=2)
draw.line([(cx-105, crown_y+95), (cx+105, crown_y+95)], fill=gold_dark, width=4)

# Left Olive Branch
def draw_leaf(draw, x, y, angle, size=18):
    rad = math.radians(angle)
    dx = math.cos(rad) * size
    dy = math.sin(rad) * size * 0.6
    points = [(x, y), (x + dx*1.3, y + dy*0.5), (x + dx*0.8, y + dy*1.2), (x, y + dy*0.8)]
    draw.polygon(points, fill=gold, outline=gold_dark, width=1)

branch_x = [220, 200, 185, 195, 210, 205, 215, 225, 235, 240]
branch_y = [380, 430, 480, 530, 580, 610, 640]
for i in range(len(branch_y)-1):
    x1 = branch_x[i] + math.sin(i*0.8)*15
    x2 = branch_x[i+1] + math.sin((i+1)*0.8)*15
    draw.line([(x1, branch_y[i]), (x2, branch_y[i+1])], fill=gold, width=7)
    draw_leaf(draw, x1-10, branch_y[i], -35, 16)
    draw_leaf(draw, x1-5, branch_y[i]+15, -25, 14)

for i in range(len(branch_y)-1):
    x1 = (1024 - branch_x[i]) - math.sin(i*0.8)*15
    x2 = (1024 - branch_x[i+1]) - math.sin((i+1)*0.8)*15
    draw.line([(x1, branch_y[i]), (x2, branch_y[i+1])], fill=gold, width=7)
    draw_leaf(draw, x1+10, branch_y[i], 215, 16)
    draw_leaf(draw, x1+5, branch_y[i]+15, 205, 14)

# Center Shield - hexagonal (larger to fit text)
shield_size = 220
shield_points = [
    (cx, cy - 140),
    (cx + shield_size, cy - 50),
    (cx + shield_size, cy + 90),
    (cx, cy + 220),
    (cx - shield_size, cy + 90),
    (cx - shield_size, cy - 50)
]
draw.polygon(shield_points, fill=gold, outline=gold_dark, width=8)
inner_points = [
    (cx, cy - 120),
    (cx + shield_size - 20, cy - 40),
    (cx + shield_size - 20, cy + 75),
    (cx, cy + 195),
    (cx - shield_size + 20, cy + 75),
    (cx - shield_size + 20, cy - 40)
]
draw.polygon(inner_points, fill=dark2, outline=gold, width=3)

# Inner decorative circles
draw.ellipse([cx - 120, cy - 70, cx + 120, cy + 170], outline=gold, width=4)
draw.ellipse([cx - 95, cy - 45, cx + 95, cy + 145], outline=(*gold[:3], 120), width=2)

# Small star at top of shield
star_points = [(cx, cy-110), (cx+6, cy-98), (cx+18, cy-98), (cx+9, cy-90), (cx+12, cy-78), (cx, cy-86), (cx-12, cy-78), (cx-9, cy-90), (cx-18, cy-98), (cx-6, cy-98)]
draw.polygon(star_points, fill=gold_light, outline=gold_dark, width=1)

# Load fonts
try:
    font_title = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 95)
    font_sub = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 40)
    font_ribbon = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 30)
    font_small = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
except:
    font_title = ImageFont.load_default()
    font_sub = font_title
    font_ribbon = font_title
    font_small = font_title

# Main text
text1 = "THIQAH"
bbox1 = draw.textbbox((0, 0), text1, font=font_title)
tw1 = bbox1[2] - bbox1[0]
draw.text((cx - tw1//2, cy - 30), text1, font=font_title, fill=gold_light)

text2 = "AL DHAHABIYA"
bbox2 = draw.textbbox((0, 0), text2, font=font_sub)
tw2 = bbox2[2] - bbox2[0]
draw.text((cx - tw2//2, cy + 65), text2, font=font_sub, fill=gold)

# Bottom Ribbon
ribbon_y = 740
ribbon_outer = [(280, ribbon_y), (cx, ribbon_y+110), (744, ribbon_y), (744, ribbon_y+60), (cx, ribbon_y+170), (280, ribbon_y+60)]
draw.polygon(ribbon_outer, fill=gold, outline=gold_dark, width=5)
ribbon_inner = [(300, ribbon_y+12), (cx, ribbon_y+108), (724, ribbon_y+12), (724, ribbon_y+48), (cx, ribbon_y+145), (300, ribbon_y+48)]
draw.polygon(ribbon_inner, fill=dark3, outline=None)

text3 = "GENERAL SERVICES OFFICE"
bbox3 = draw.textbbox((0, 0), text3, font=font_ribbon)
tw3 = bbox3[2] - bbox3[0]
draw.text((cx - tw3//2, ribbon_y+18), text3, font=font_ribbon, fill=gold_light)

text4 = "SAUDI ARABIA"
bbox4 = draw.textbbox((0, 0), text4, font=font_small)
tw4 = bbox4[2] - bbox4[0]
draw.text((cx - tw4//2, ribbon_y+52), text4, font=font_small, fill=gold)

# Subtle glow
img = img.filter(ImageFilter.GaussianBlur(radius=0.3))

os.makedirs('public/assets', exist_ok=True)
img.save('public/assets/thiqqah-logo-new.png', 'PNG')
print('Final logo generated: public/assets/thiqqah-logo-new.png')
