"""
Crop Disease Dataset Module (PyTorch)
Handles data loading, augmentation, preprocessing, and DataLoader creation.
"""

import os
import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# ImageNet standard normalization parameters
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

def get_transforms(img_size=(224, 224)):
    """
    Returns training and validation image transformations.
    
    Training transformations include augmentations (crops, flips, rotations, color jitter)
    to prevent overfitting on leaf image datasets.
    """
    train_transform = transforms.Compose([
        transforms.Resize(img_size),
        transforms.RandomResizedCrop(img_size[0], scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(degrees=20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])

    val_transform = transforms.Compose([
        transforms.Resize(img_size),
        transforms.CenterCrop(img_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])

    return train_transform, val_transform

def get_dataloaders(data_dir, batch_size=32, num_workers=0, img_size=(224, 224)):
    """
    Loads dataset from ImageFolder structure:
      data_dir/train/<class_name>/*.jpg
      data_dir/val/<class_name>/*.jpg
    
    Or if train/val subdirectories are missing, splits a single ImageFolder into 80/20 train/val.
    
    Returns:
        train_loader (DataLoader): PyTorch DataLoader for training
        val_loader (DataLoader): PyTorch DataLoader for validation
        class_names (list): List of disease class string names
    """
    train_transform, val_transform = get_transforms(img_size)

    train_path = os.path.join(data_dir, 'train')
    val_path = os.path.join(data_dir, 'val')

    if os.path.exists(train_path) and os.path.exists(val_path):
        # Standard PlantVillage layout with train/ and val/ folders
        train_dataset = datasets.ImageFolder(root=train_path, transform=train_transform)
        val_dataset = datasets.ImageFolder(root=val_path, transform=val_transform)
        class_names = train_dataset.classes
    elif os.path.exists(data_dir):
        # Single directory containing class subfolders: split 80/20
        full_dataset = datasets.ImageFolder(root=data_dir, transform=train_transform)
        class_names = full_dataset.classes
        
        train_size = int(0.8 * len(full_dataset))
        val_size = len(full_dataset) - train_size
        
        train_dataset, val_dataset = torch.utils.data.random_split(
            full_dataset, [train_size, val_size],
            generator=torch.Generator().manual_seed(42)
        )
        # Apply validation transforms to val_dataset
        val_dataset.dataset.transform = val_transform
    else:
        raise FileNotFoundError(f"Dataset directory '{data_dir}' not found.")

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available()
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=torch.cuda.is_available()
    )

    return train_loader, val_loader, class_names

if __name__ == "__main__":
    print("[+] dataset.py module loaded successfully.")
