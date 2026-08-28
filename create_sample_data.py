"""
Synthetic PlantVillage Dataset Generator
Creates sample leaf-like images for 8 crop disease classes in data/train and data/val
so the training and inference pipeline can be tested immediately without downloading full dataset.
"""

import os
import numpy as np
from PIL import Image, ImageDraw

CLASSES = [
    "Tomato_Early_Blight",
    "Tomato_Late_Blight",
    "Tomato_Healthy",
    "Potato_Early_Blight",
    "Potato_Late_Blight",
    "Potato_Healthy",
    "Corn_Common_Rust",
    "Corn_Healthy"
]

def generate_synthetic_leaf(class_name, img_size=(224, 224)):
    """Generates a synthetic leaf image with specific visual cues based on class name."""
    # Base green leaf canvas
    base_color = (34, 139, 34) if "Healthy" in class_name else (85, 107, 47)
    img = Image.new("RGB", img_size, color=base_color)
    draw = ImageDraw.Draw(img)

    # Draw leaf veins
    draw.line([(112, 10), (112, 214)], fill=(0, 100, 0), width=4)
    draw.line([(112, 50), (40, 120)], fill=(0, 100, 0), width=2)
    draw.line([(112, 50), (184, 120)], fill=(0, 100, 0), width=2)
    draw.line([(112, 120), (30, 180)], fill=(0, 100, 0), width=2)
    draw.line([(112, 120), (194, 180)], fill=(0, 100, 0), width=2)

    # Draw disease spots based on class
    if "Early_Blight" in class_name:
        # Concentric brown rings
        for center in [(70, 80), (140, 150), (90, 160)]:
            draw.ellipse([center[0]-25, center[1]-25, center[0]+25, center[1]+25], fill=(101, 67, 33), outline=(255, 215, 0), width=2)
            draw.ellipse([center[0]-15, center[1]-15, center[0]+15, center[1]+15], fill=(139, 69, 19))
            draw.ellipse([center[0]-5, center[1]-5, center[0]+5, center[1]+5], fill=(50, 20, 10))

    elif "Late_Blight" in class_name:
        # Dark water-soaked lesions with pale white borders
        for center in [(80, 100), (150, 90)]:
            draw.ellipse([center[0]-35, center[1]-30, center[0]+35, center[1]+30], fill=(240, 240, 240))
            draw.ellipse([center[0]-30, center[1]-25, center[0]+30, center[1]+25], fill=(47, 47, 47))

    elif "Rust" in class_name:
        # Reddish brown rusty pustules
        for _ in range(15):
            rx, ry = np.random.randint(40, 180), np.random.randint(40, 180)
            draw.ellipse([rx-8, ry-5, rx+8, ry+5], fill=(178, 34, 34), outline=(255, 140, 0))

    # Add random pixel noise for variability
    arr = np.array(img)
    noise = np.random.randint(-15, 15, arr.shape, dtype=np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def create_dataset(base_dir="./data", train_samples_per_class=12, val_samples_per_class=4):
    """Creates directory structure and synthetic images."""
    print(f"[*] Generating synthetic PlantVillage dataset in '{base_dir}'...")

    for split, num_samples in [("train", train_samples_per_class), ("val", val_samples_per_class)]:
        for cname in CLASSES:
            folder = os.path.join(base_dir, split, cname)
            os.makedirs(folder, exist_ok=True)

            for idx in range(1, num_samples + 1):
                img = generate_synthetic_leaf(cname)
                filepath = os.path.join(folder, f"{cname}_{idx:03d}.jpg")
                img.save(filepath, "JPEG", quality=90)

    print(f"[✓] Synthetic dataset created successfully with {len(CLASSES)} classes!")
    print(f"    Train folder: {os.path.join(base_dir, 'train')}")
    print(f"    Val folder:   {os.path.join(base_dir, 'val')}")

if __name__ == "__main__":
    create_dataset()
