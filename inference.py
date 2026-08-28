"""
Crop Disease Inference Engine (PyTorch)
Loads trained EfficientNet-B0 weights & class mapping to perform predictions on leaf images.
Includes Crop-Aware Filtering and Confidence Safeguards.
"""

import os
import json
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from model import build_model
from dataset import IMAGENET_MEAN, IMAGENET_STD

class DiseasePredictor:
    def __init__(self, model_path="./models/best_model.pth", classes_path="./models/classes.json", device=None):
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = device

        self.model_path = model_path
        self.classes_path = classes_path

        # 1. Load class labels
        if not os.path.exists(classes_path):
            raise FileNotFoundError(f"Class mapping file '{classes_path}' not found.")
        
        with open(classes_path, "r") as f:
            self.class_names = json.load(f)
            
        self.num_classes = len(self.class_names)

        # 2. Load PyTorch model architecture and weights
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model checkpoint file '{model_path}' not found.")

        self.model = build_model(num_classes=self.num_classes, pretrained=False)
        state_dict = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

        # 3. Image Preprocessing pipeline
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
        ])

    def predict(self, image_input, crop_filter=None, confidence_threshold=0.60):
        """
        Performs inference with optional crop-aware filtering.
        """
        if isinstance(image_input, str):
            if not os.path.exists(image_input):
                raise FileNotFoundError(f"Input image path '{image_input}' does not exist.")
            img = Image.open(image_input).convert("RGB")
        elif isinstance(image_input, Image.Image):
            img = image_input.convert("RGB")
        else:
            raise ValueError("image_input must be a file path string or PIL.Image instance.")

        tensor_img = self.transform(img).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor_img).squeeze(0)
            probabilities = F.softmax(logits, dim=0)

        # Apply crop filter if provided (e.g. "Rice", "Paddy", "Tomato", "Potato", "Corn", "Wheat")
        if crop_filter:
            crop_clean = crop_filter.lower().split("(")[0].strip() # e.g. "paddy" -> "paddy" or "rice"
            
            # Map common crop aliases
            alias_map = {
                "paddy": ["rice", "paddy"],
                "rice": ["rice", "paddy"],
                "maize": ["corn", "maize"],
                "corn": ["corn", "maize"],
                "chilli": ["pepper", "chilli"],
                "chili": ["pepper", "chilli"]
            }
            target_keywords = alias_map.get(crop_clean, [crop_clean])

            # Filter indices matching crop
            valid_indices = [
                i for i, cname in enumerate(self.class_names)
                if any(kw in cname.lower() for kw in target_keywords)
            ]

            if valid_indices:
                # Mask out invalid crop classes
                masked_probs = probabilities.clone()
                for i in range(self.num_classes):
                    if i not in valid_indices:
                        masked_probs[i] = 0.0
                
                sum_p = masked_probs.sum()
                if sum_p > 0:
                    probabilities = masked_probs / sum_p

        # Extract top prediction
        top_prob, top_idx = torch.max(probabilities, dim=0)
        confidence = float(top_prob.cpu().item())
        predicted_class = self.class_names[top_idx.item()]

        prob_dict = {
            self.class_names[i]: round(float(probabilities[i].cpu().item()), 4)
            for i in range(self.num_classes)
        }

        is_uncertain = confidence < confidence_threshold

        return {
            "disease_name": predicted_class,
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2),
            "is_uncertain": is_uncertain,
            "top_guess": predicted_class,
            "confidence_threshold": confidence_threshold,
            "all_probabilities": prob_dict
        }

_predictor_instance = None
_last_model_mtime = 0
_last_classes_mtime = 0

def predict(image_input, crop_filter=None, confidence_threshold=0.50, model_path="./models/best_model.pth", classes_path="./models/classes.json"):
    global _predictor_instance, _last_model_mtime, _last_classes_mtime
    
    mtime_model = os.path.getmtime(model_path) if os.path.exists(model_path) else 0
    mtime_classes = os.path.getmtime(classes_path) if os.path.exists(classes_path) else 0

    if (_predictor_instance is None or 
        mtime_model != _last_model_mtime or 
        mtime_classes != _last_classes_mtime):
        
        print(f"[+] Reloading DiseasePredictor with updated weights/classes (Classes: {classes_path})")
        _predictor_instance = DiseasePredictor(model_path=model_path, classes_path=classes_path)
        _last_model_mtime = mtime_model
        _last_classes_mtime = mtime_classes

    return _predictor_instance.predict(image_input, crop_filter=crop_filter, confidence_threshold=confidence_threshold)
