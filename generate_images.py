import os
import random
from PIL import Image, ImageDraw, ImageFilter

# Create images directory
os.makedirs('images', exist_ok=True)

# Generate 31 minimalist pale abstract images
for i in range(1, 32):
    width, height = 1200, 800
    
    # Base color: Overwhelming white / very pale gray
    base_color = (
        random.randint(245, 255),
        random.randint(245, 255),
        random.randint(245, 255)
    )
    img = Image.new('RGB', (width, height), base_color)
    draw = ImageDraw.Draw(img)
    
    # Add subtle, pale abstract shapes
    for _ in range(random.randint(2, 4)):
        x = random.randint(-400, width)
        y = random.randint(-400, height)
        w = random.randint(400, 1000)
        h = random.randint(400, 1000)
        
        # Pale pastel colors for subtle visual silence
        shape_color = (
            random.randint(235, 255),
            random.randint(235, 255),
            random.randint(235, 255)
        )
        
        draw.ellipse([x, y, x+w, y+h], fill=shape_color)
            
    # Apply strong blur to make it completely abstract and "silent"
    img = img.filter(ImageFilter.GaussianBlur(radius=random.randint(80, 200)))
    
    filename = f'images/abstract-{i:02d}.png'
    img.save(filename)
    print(f"Generated {filename}")
