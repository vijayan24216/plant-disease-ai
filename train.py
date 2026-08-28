"""
PyTorch Training Script for Crop Disease Classifier
Includes Two-Phase Training (Feature Extraction -> Fine-Tuning), Model Checkpointing,
Class Mapping Serialization, and Evaluation Metrics (Confusion Matrix, Classification Report).
"""

import os
import json
import time
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import classification_report, confusion_matrix

from dataset import get_dataloaders
from model import build_model

def get_device():
    """Detect CUDA GPU or CPU fallback."""
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print(f"[+] GPU detected: {torch.cuda.get_device_name(0)}")
    else:
        device = torch.device("cpu")
        print("[!] No GPU detected. Using CPU for training.")
    return device

def train_epoch(model, dataloader, criterion, optimizer, device):
    """Executes single training epoch."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in dataloader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    epoch_loss = running_loss / total
    epoch_acc = (correct / total) * 100.0
    return epoch_loss, epoch_acc

def validate_epoch(model, dataloader, criterion, device):
    """Executes single validation epoch."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    epoch_loss = running_loss / total
    epoch_acc = (correct / total) * 100.0
    return epoch_loss, epoch_acc, np.array(all_preds), np.array(all_labels)

def train_pipeline(data_dir, output_dir="./models", epochs_p1=5, epochs_p2=10, batch_size=32, lr_p1=1e-3, lr_p2=1e-4):
    """
    Executes full 2-Phase Training Workflow.
    Phase 1: Classifier head training (Base frozen)
    Phase 2: Full backbone fine-tuning with low learning rate
    """
    os.makedirs(output_dir, exist_ok=True)
    device = get_device()

    # 1. Load Data
    print(f"\n[*] Loading dataset from: {data_dir}")
    train_loader, val_loader, class_names = get_dataloaders(data_dir, batch_size=batch_size)
    num_classes = len(class_names)
    print(f"[+] Identified {num_classes} classes: {class_names}")

    # Save classes list to classes.json
    classes_json_path = os.path.join(output_dir, "classes.json")
    with open(classes_json_path, "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"[+] Saved class mapping to {classes_json_path}")

    # 2. Build Model
    model = build_model(num_classes=num_classes, pretrained=True).to(device)
    criterion = nn.CrossEntropyLoss()

    best_val_acc = 0.0
    checkpoint_path = os.path.join(output_dir, "best_model.pth")

    # ==========================================
    # PHASE 1: Train Classifier Head Only
    # ==========================================
    print("\n" + "="*50)
    print(f" PHASE 1: Training Classifier Head ({epochs_p1} Epochs, Base Frozen, LR={lr_p1}) ")
    print("="*50)

    model.freeze_backbone()
    optimizer_p1 = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=lr_p1)

    for epoch in range(1, epochs_p1 + 1):
        start_time = time.time()
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer_p1, device)
        val_loss, val_acc, _, _ = validate_epoch(model, val_loader, criterion, device)
        elapsed = time.time() - start_time

        print(f"Epoch [{epoch}/{epochs_p1}] ({elapsed:.1f}s) | "
              f"Train Loss: {train_loss:.4f} - Train Acc: {train_acc:.2f}% | "
              f"Val Loss: {val_loss:.4f} - Val Acc: {val_acc:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), checkpoint_path)
            print(f"  --> Saved new best checkpoint to {checkpoint_path} ({best_val_acc:.2f}%)")

    # ==========================================
    # PHASE 2: Unfreeze Backbone & Fine-Tune
    # ==========================================
    print("\n" + "="*50)
    print(f" PHASE 2: Unfreezing All Layers for Fine-Tuning ({epochs_p2} Epochs, LR={lr_p2}) ")
    print("="*50)

    model.unfreeze_backbone(unfreeze_all=True)
    optimizer_p2 = optim.Adam(model.parameters(), lr=lr_p2)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer_p2, mode='max', factor=0.5, patience=2)

    final_preds, final_labels = None, None

    for epoch in range(1, epochs_p2 + 1):
        start_time = time.time()
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer_p2, device)
        val_loss, val_acc, val_preds, val_labels = validate_epoch(model, val_loader, criterion, device)
        elapsed = time.time() - start_time
        scheduler.step(val_acc)

        print(f"Epoch [{epoch}/{epochs_p2}] ({elapsed:.1f}s) | "
              f"Train Loss: {train_loss:.4f} - Train Acc: {train_acc:.2f}% | "
              f"Val Loss: {val_loss:.4f} - Val Acc: {val_acc:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), checkpoint_path)
            print(f"  --> Saved new best checkpoint to {checkpoint_path} ({best_val_acc:.2f}%)")

        final_preds, final_labels = val_preds, val_labels

    # ==========================================
    # EVALUATION REPORT & CONFUSION MATRIX
    # ==========================================
    print("\n" + "="*50)
    print(" FINAL MODEL EVALUATION METRICS ")
    print("="*50)
    
    # Load best model state for evaluation
    if os.path.exists(checkpoint_path):
        model.load_state_dict(torch.load(checkpoint_path, map_location=device))
        _, _, final_preds, final_labels = validate_epoch(model, val_loader, criterion, device)

    print("\n--- Classification Report ---")
    print(classification_report(final_labels, final_preds, target_names=class_names, zero_division=0))

    print("--- Confusion Matrix ---")
    cm = confusion_matrix(final_labels, final_preds)
    print(cm)

    print(f"\n[✓] Training Complete! Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"[✓] Checkpoint saved: {checkpoint_path}")
    print(f"[✓] Class labels saved: {classes_json_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train PyTorch Plant Disease Model")
    parser.add_argument("--data_dir", type=str, default="./data", help="Path to dataset directory")
    parser.add_argument("--output_dir", type=str, default="./models", help="Output folder for best_model.pth and classes.json")
    parser.add_argument("--epochs_p1", type=int, default=5, help="Phase 1 epochs (classifier head only)")
    parser.add_argument("--epochs_p2", type=int, default=10, help="Phase 2 epochs (full fine-tuning)")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr_p1", type=float, default=1e-3, help="Learning rate Phase 1")
    parser.add_argument("--lr_p2", type=float, default=1e-4, help="Learning rate Phase 2")

    args = parser.parse_args()

    if not os.path.exists(args.data_dir):
        print(f"[!] Target dataset directory '{args.data_dir}' not found.")
        print("[!] Tip: Run 'python create_sample_data.py' to generate a synthetic dataset for testing!")
    else:
        train_pipeline(
            data_dir=args.data_dir,
            output_dir=args.output_dir,
            epochs_p1=args.epochs_p1,
            epochs_p2=args.epochs_p2,
            batch_size=args.batch_size,
            lr_p1=args.lr_p1,
            lr_p2=args.lr_p2
        )
