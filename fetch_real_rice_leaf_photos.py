"""
Rice Real-World Leaf Photo Collector
Downloads real-world Paddy & Rice leaf photographs into data/train and data/val
"""

import os
import urllib.request
import time

RICE_PHOTO_SOURCES = {
    "Rice_Blast": [
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_01.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_02.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_03.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_04.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_05.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_06.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_07.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_08.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_09.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Blast/blast_orig_10.jpg"
    ],
    "Rice_Brown_Spot": [
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_01.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_02.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_03.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_04.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_05.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_06.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_07.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_08.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_09.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Brownspot/brownspot_orig_10.jpg"
    ],
    "Rice_Bacterial_Blight": [
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_01.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_02.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_03.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_04.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_05.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_06.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_07.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_08.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_09.jpg",
        "https://raw.githubusercontent.com/alifmaula/Rice-Leaf-Diseases-Dataset/master/Bacterialblight/bacterial_orig_10.jpg"
    ]
}

def download_rice_photos(base_dir="./data"):
    headers = {"User-Agent": "AgriCentral-AI/2.0"}

    for rclass, urls in RICE_PHOTO_SOURCES.items():
        train_dir = os.path.join(base_dir, "train", rclass)
        val_dir = os.path.join(base_dir, "val", rclass)
        os.makedirs(train_dir, exist_ok=True)
        os.makedirs(val_dir, exist_ok=True)

        for i, url in enumerate(urls):
            target_dir = train_dir if i < 7 else val_dir
            filename = f"{rclass}_real_{i+1:03d}.jpg"
            filepath = os.path.join(target_dir, filename)

            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=10) as resp, open(filepath, 'wb') as f:
                    f.write(resp.read())
                print(f"[✓] Downloaded real rice photo: {filename}")
            except Exception as e:
                print(f"[!] Warning downloading {url}: {e}")

if __name__ == "__main__":
    download_rice_photos()
