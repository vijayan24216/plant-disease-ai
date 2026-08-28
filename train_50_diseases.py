"""
50-Crop Disease AI Model Trainer
Generates data and trains a PyTorch EfficientNet-B0 classifier across 50 common agricultural disease classes.
"""

import os
import json
import time
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from PIL import Image, ImageDraw

from dataset import get_dataloaders
from model import build_model

CLASSES_FILE = "./models/classes.json"
DATA_DIR = "./data"
OUTPUT_DIR = "./models"

# 50 Common Agricultural Diseases Taxonomy
CLASSES_50 = [
    "Apple_Scab",
    "Apple_Black_Rot",
    "Apple_Cedar_Rust",
    "Apple_Healthy",
    "Blueberry_Healthy",
    "Cherry_Powdery_Mildew",
    "Cherry_Healthy",
    "Corn_Common_Rust",
    "Corn_Gray_Leaf_Spot",
    "Corn_Northern_Leaf_Blight",
    "Corn_Healthy",
    "Cotton_Bacterial_Blight",
    "Cotton_Healthy",
    "Grape_Black_Rot",
    "Grape_Esca_Black_Measles",
    "Grape_Leaf_Blight",
    "Grape_Healthy",
    "Orange_Citrus_Greening_Huanglongbing",
    "Peach_Bacterial_Spot",
    "Peach_Healthy",
    "Pepper_Bacterial_Spot",
    "Pepper_Healthy",
    "Potato_Early_Blight",
    "Potato_Late_Blight",
    "Potato_Healthy",
    "Raspberry_Healthy",
    "Rice_Blast",
    "Rice_Brown_Spot",
    "Rice_Bacterial_Blight",
    "Rice_Healthy",
    "Soybean_Healthy",
    "Squash_Powdery_Mildew",
    "Strawberry_Leaf_Scorch",
    "Strawberry_Healthy",
    "Sugarcane_Red_Rot",
    "Sugarcane_Smut",
    "Sugarcane_Healthy",
    "Tomato_Bacterial_Spot",
    "Tomato_Early_Blight",
    "Tomato_Late_Blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_Leaf_Spot",
    "Tomato_Spider_Mites",
    "Tomato_Target_Spot",
    "Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_Mosaic_Virus",
    "Tomato_Healthy",
    "Wheat_Yellow_Rust",
    "Wheat_Brown_Rust",
    "Wheat_Healthy"
]

def generate_leaf_sample(class_name, img_size=(224, 224)):
    """Generates synthetic visual pattern for any of the 50 crop classes."""
    is_healthy = "Healthy" in class_name
    base_color = (34, 139, 34) if is_healthy else (85, 107, 47)
    img = Image.new("RGB", img_size, color=base_color)
    draw = ImageDraw.Draw(img)

    # Leaf structure lines
    draw.line([(112, 10), (112, 214)], fill=(0, 100, 0), width=4)
    draw.line([(112, 50), (40, 120)], fill=(0, 100, 0), width=2)
    draw.line([(112, 50), (184, 120)], fill=(0, 100, 0), width=2)
    draw.line([(112, 120), (30, 180)], fill=(0, 100, 0), width=2)
    draw.line([(112, 120), (194, 180)], fill=(0, 100, 0), width=2)

    if not is_healthy:
        if "Blight" in class_name or "Spot" in class_name:
            for center in [(70, 80), (140, 150), (90, 160)]:
                draw.ellipse([center[0]-20, center[1]-20, center[0]+20, center[1]+20], fill=(101, 67, 33), outline=(255, 215, 0), width=2)
        elif "Rust" in class_name or "Rot" in class_name:
            for _ in range(12):
                rx, ry = np.random.randint(40, 180), np.random.randint(40, 180)
                draw.ellipse([rx-8, ry-5, rx+8, ry+5], fill=(178, 34, 34), outline=(255, 140, 0))
        else:
            for center in [(80, 100), (150, 90)]:
                draw.ellipse([center[0]-25, center[1]-25, center[0]+25, center[1]+25], fill=(240, 240, 240))
                draw.ellipse([center[0]-20, center[1]-20, center[0]+20, center[1]+20], fill=(47, 47, 47))

    arr = np.array(img)
    noise = np.random.randint(-15, 15, arr.shape, dtype=np.int16)
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def prepare_50_dataset():
    """Populates training/validation dataset for all 50 classes."""
    print(f"[*] Preparing 50-Class Dataset in '{DATA_DIR}'...")
    for split, samples in [("train", 8), ("val", 3)]:
        for cname in CLASSES_50:
            folder = os.path.join(DATA_DIR, split, cname)
            os.makedirs(folder, exist_ok=True)
            for idx in range(1, samples + 1):
                img = generate_leaf_sample(cname)
                img.save(os.path.join(folder, f"{cname}_{idx:03d}.jpg"), "JPEG", quality=90)
    
    # Save classes.json
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(CLASSES_FILE, "w") as f:
        json.dump(CLASSES_50, f, indent=2)
    print(f"[✓] Saved 50 class labels to {CLASSES_FILE}")

def train_50_model():
    """Trains PyTorch EfficientNet-B0 model for 50 classes."""
    prepare_50_dataset()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n[*] Training 50-Class Model on Device: {device}")

    train_loader, val_loader, class_names = get_dataloaders(DATA_DIR, batch_size=16)
    num_classes = len(class_names)
    print(f"[+] Loaded {num_classes} crop disease classes!")

    model = build_model(num_classes=num_classes, pretrained=True).to(device)
    criterion = nn.CrossEntropyLoss()

    # Quick 2-phase training pass
    print("\n" + "="*50)
    print(f" Phase 1: Feature Extraction Head Training (50 Classes) ")
    print("="*50)

    model.freeze_backbone()
    optimizer = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3)

    for epoch in range(1, 4):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for imgs, lbls in train_loader:
            imgs, lbls = imgs.to(device), lbls.to(device)
            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, lbls)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * imgs.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == lbls).sum().item()
            total += lbls.size(0)

        acc = (correct / total) * 100.0
        print(f"Epoch [{epoch}/3] - Train Loss: {running_loss/total:.4f} | Accuracy: {acc:.2f}%")

    # Save trained checkpoint
    best_path = os.path.join(OUTPUT_DIR, "best_model.pth")
    torch.save(model.state_dict(), best_path)
    print(f"\n[✓] 50-Class AI Model Successfully Trained & Saved to: {best_path}")

if __name__ == "__main__":
    train_50_model()
