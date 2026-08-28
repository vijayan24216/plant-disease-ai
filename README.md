# 🌿 AI-Based Crop Disease Identification System

An end-to-end deep learning solution built with **PyTorch (EfficientNet-B0)**, **FastAPI**, and **React**. The application identifies plant diseases from leaf images and returns disease causes, symptoms, prevention strategies, and treatment recommendations.

---

## 🏗️ Project Architecture & Layout

```text
plant-disease-ai/
├── dataset.py            # PyTorch ImageFolder dataset loader & data augmentations
├── model.py              # Pretrained EfficientNet-B0 transfer learning architecture
├── train.py              # 2-Phase training script (classifier head -> fine-tuning)
├── inference.py          # PyTorch predictor module with confidence thresholding
├── app.py                # FastAPI REST backend API (/predict, /health, /diseases)
├── disease_info.json     # Agronomic knowledge database (symptoms, causes, treatments)
├── create_sample_data.py # Synthetic PlantVillage dataset generator for instant testing
├── requirements.txt      # Python dependencies
├── README.md             # Project documentation
└── frontend/             # Mobile-friendly React Web App (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx       # Single-page interface with camera capture & diagnostic cards
        ├── index.css     # Responsive glassmorphism styling & accessibility
        └── main.jsx
```

---

## 📁 Dataset Folder Structure

Organize your PlantVillage (or custom crop leaf) dataset in standard `ImageFolder` structure:

```text
data/
├── train/
│   ├── Tomato_Early_Blight/
│   │   ├── image001.jpg
│   │   └── image002.jpg
│   ├── Tomato_Late_Blight/
│   ├── Tomato_Healthy/
│   ├── Potato_Early_Blight/
│   ├── Potato_Late_Blight/
│   ├── Potato_Healthy/
│   ├── Corn_Common_Rust/
│   └── Corn_Healthy/
└── val/
    ├── Tomato_Early_Blight/
    ├── Tomato_Late_Blight/
    ├── Tomato_Healthy/
    └── ...
```

---

## 🚀 Quick Start Guide

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Prepare / Generate Dataset

If you already have the PlantVillage dataset downloaded, place it in `./data`.

If you want to test the entire system **immediately** out-of-the-box without downloading 2GB of images, generate a synthetic dataset:

```bash
python create_sample_data.py
```

### 3. Train the PyTorch AI Model

Run the 2-phase training pipeline:

```bash
python train.py --data_dir ./data --epochs_p1 5 --epochs_p2 10 --batch_size 32
```

This will output:
- `models/best_model.pth` (Trained PyTorch weights)
- `models/classes.json` (Serialized class label mapping)
- Print per-class accuracy & Scikit-Learn confusion matrix.

### 4. Start the FastAPI Backend API

```bash
python app.py
```
Or with Uvicorn directly:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 5. Launch the React Web Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser or mobile device.

---

## ⚡ Features & Capabilities

- **Transfer Learning**: Built on PyTorch `EfficientNet-B0` pretrained on ImageNet.
- **Two-Phase Training**: Phase 1 trains top classifier head; Phase 2 fine-tunes deep feature layers with a reduced learning rate.
- **Uncertainty Guardrail**: Returns an explicit `"Low Confidence"` warning if prediction confidence drops below configured threshold (default 60%).
- **Mobile-Friendly Camera Capture**: Directly snap leaf photos via webcam or mobile device camera.
- **Agronomic Knowledge Base**: Integrates disease causes, symptoms, organic/chemical treatment advice.
