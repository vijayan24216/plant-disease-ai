"""
Crop Disease Transfer Learning Model (PyTorch)
Uses EfficientNet-B0 backbone pretrained on ImageNet for crop leaf disease classification.
"""

import torch
import torch.nn as nn
from torchvision import models

class CropDiseaseEfficientNet(nn.Module):
    def __init__(self, num_classes, pretrained=True, dropout_rate=0.3):
        """
        Initializes EfficientNet-B0 with custom classification head.
        
        Args:
            num_classes (int): Number of disease classes to predict
            pretrained (bool): Whether to load ImageNet pretrained weights
            dropout_rate (float): Dropout probability before final linear layer
        """
        super(CropDiseaseEfficientNet, self).__init__()
        
        # Load EfficientNet-B0 weights
        if hasattr(models, "EfficientNet_B0_Weights"):
            weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
            self.model = models.efficientnet_b0(weights=weights)
        else:
            self.model = models.efficientnet_b0(pretrained=pretrained)
        
        # Extract input features dimension from the original classifier head
        in_features = self.model.classifier[1].in_features
        
        # Replace original classifier head with custom classification layer
        self.model.classifier = nn.Sequential(
            nn.Dropout(p=dropout_rate, inplace=True),
            nn.Linear(in_features=in_features, out_features=num_classes)
        )
        
        # Freeze base parameters by default for Phase 1 feature extraction
        self.freeze_backbone()

    def freeze_backbone(self):
        """Freeze all backbone parameters except the custom classifier head."""
        for param in self.model.features.parameters():
            param.requires_grad = False
        for param in self.model.classifier.parameters():
            param.requires_grad = True
        print("[*] Base EfficientNet-B0 layers frozen (Phase 1 mode).")

    def unfreeze_backbone(self, unfreeze_all=True):
        """
        Unfreeze backbone layers for Phase 2 fine-tuning.
        
        Args:
            unfreeze_all (bool): If True, unfreezes all parameters. 
                                 If False, unfreezes top feature blocks.
        """
        if unfreeze_all:
            for param in self.model.parameters():
                param.requires_grad = True
            print("[*] All EfficientNet-B0 backbone layers unfrozen (Phase 2 full fine-tuning).")
        else:
            # Unfreeze only the last few feature blocks (blocks 5, 6, 7)
            for param in self.model.features.parameters():
                param.requires_grad = False
            for block in self.model.features[5:]:
                for param in block.parameters():
                    param.requires_grad = True
            print("[*] Top feature blocks unfrozen for targeted fine-tuning.")

    def forward(self, x):
        return self.model(x)

def build_model(num_classes, pretrained=True):
    """
    Factory helper function to build and return CropDiseaseEfficientNet instance.
    """
    model = CropDiseaseEfficientNet(num_classes=num_classes, pretrained=pretrained)
    return model

if __name__ == "__main__":
    test_model = build_model(num_classes=8)
    dummy_input = torch.randn(2, 3, 224, 224)
    out = test_model(dummy_input)
    print(f"[+] Output shape: {out.shape} (Expected: [2, 8])")
