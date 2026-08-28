"""
Real-World Plant Disease Image Downloader
Downloads authentic real-world crop leaf photographs from open public datasets (PlantVillage GitHub mirror)
and populates data/train and data/val to replace synthetic placeholders with real photos.
"""

import os
import json
import urllib.request
import time

# List of GitHub Raw Base URLs for real leaf images
RAW_GITHUB_BASE = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color"

# Class Mapping from local directory names to GitHub PlantVillage repository folder names
FOLDER_MAP = {
    "Apple_Scab": "Apple___Apple_scab",
    "Apple_Black_Rot": "Apple___Black_rot",
    "Apple_Cedar_Rust": "Apple___Cedar_apple_rust",
    "Apple_Healthy": "Apple___healthy",
    "Blueberry_Healthy": "Blueberry___healthy",
    "Cherry_Powdery_Mildew": "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_Healthy": "Cherry_(including_sour)___healthy",
    "Corn_Common_Rust": "Corn_(maize)___Common_rust_",
    "Corn_Gray_Leaf_Spot": "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_Northern_Leaf_Blight": "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_Healthy": "Corn_(maize)___healthy",
    "Grape_Black_Rot": "Grape___Black_rot",
    "Grape_Esca_Black_Measles": "Grape___Esca_(Black_Measles)",
    "Grape_Leaf_Blight": "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape_Healthy": "Grape___healthy",
    "Orange_Citrus_Greening_Huanglongbing": "Orange___Haunglongbing_(Citrus_greening)",
    "Peach_Bacterial_Spot": "Peach___Bacterial_spot",
    "Peach_Healthy": "Peach___healthy",
    "Pepper_Bacterial_Spot": "Pepper,_bell___Bacterial_spot",
    "Pepper_Healthy": "Pepper,_bell___healthy",
    "Potato_Early_Blight": "Potato___Early_blight",
    "Potato_Late_Blight": "Potato___Late_blight",
    "Potato_Healthy": "Potato___healthy",
    "Raspberry_Healthy": "Raspberry___healthy",
    "Soybean_Healthy": "Soybean___healthy",
    "Squash_Powdery_Mildew": "Squash___Powdery_mildew",
    "Strawberry_Leaf_Scorch": "Strawberry___Leaf_scorch",
    "Strawberry_Healthy": "Strawberry___healthy",
    "Tomato_Bacterial_Spot": "Tomato___Bacterial_spot",
    "Tomato_Early_Blight": "Tomato___Early_blight",
    "Tomato_Late_Blight": "Tomato___Late_blight",
    "Tomato_Leaf_Mold": "Tomato___Leaf_Mold",
    "Tomato_Septoria_Leaf_Spot": "Tomato___Septoria_leaf_spot",
    "Tomato_Spider_Mites": "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato_Target_Spot": "Tomato___Target_Spot",
    "Tomato_Yellow_Leaf_Curl_Virus": "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_Mosaic_Virus": "Tomato___Tomato_mosaic_virus",
    "Tomato_Healthy": "Tomato___healthy"
}

def fetch_image_list_from_api(github_folder):
    """Fetches list of real image filenames from GitHub API for a given folder."""
    api_url = f"https://api.github.com/repos/spMohanty/PlantVillage-Dataset/contents/raw/color/{urllib.parse.quote(github_folder)}"
    req = urllib.request.Request(api_url, headers={"User-Agent": "AgriCentral-AI"})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return [item['download_url'] for item in data if item['name'].endswith(('.JPG', '.jpg', '.png'))]
    except Exception as e:
        print(f"[!] Warning: Could not fetch GitHub API for {github_folder}: {e}")
    return []

def download_real_images(base_dir="./data"):
    """Downloads authentic real plant leaf images for all supported classes."""
    print("[*] Initiating real-world plant leaf photo collection...")

    headers = {"User-Agent": "AgriCentral-AI/2.0"}

    for local_class, gh_folder in FOLDER_MAP.items():
        print(f"\n[+] Fetching real-world leaf photos for: {local_class} ({gh_folder})...")
        download_urls = fetch_image_list_from_api(gh_folder)

        if not download_urls:
            print(f"[!] No online image URLs found for {local_class}, keeping local files.")
            continue

        # Download 10 real photos for train, 3 for val
        train_dir = os.path.join(base_dir, "train", local_class)
        val_dir = os.path.join(base_dir, "val", local_class)

        os.makedirs(train_dir, exist_ok=True)
        os.makedirs(val_dir, exist_ok=True)

        count = 0
        for url in download_urls[:14]: # Take 14 real images
            filename = os.path.basename(url)
            target_dir = train_dir if count < 10 else val_dir
            filepath = os.path.join(target_dir, filename)

            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=10) as response, open(filepath, 'wb') as out_file:
                    out_file.write(response.read())
                count += 1
                print(f"  [✓] Downloaded real photo: {filename} ({count}/14)")
                time.sleep(0.1) # Respectful delay
            except Exception as err:
                print(f"  [!] Failed downloading {filename}: {err}")

    print("\n[✓] Real-world plant disease dataset download complete!")

if __name__ == "__main__":
    download_real_images()
