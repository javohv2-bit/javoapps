#!/usr/bin/env python3
"""
Remove Background Script
Uses rembg to remove white backgrounds from product images
Saves as transparent PNGs ready for upload

Usage: python3 scripts/remove-backgrounds.py
"""

import os
import sys
import requests
from io import BytesIO
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("❌ Missing dependencies. Install with:")
    print("   pip3 install rembg pillow")
    sys.exit(1)

# Output directory
OUTPUT_DIR = Path("public/images/products-transparent")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Images to process - EOS 5D Mark IV and Rebel T100
# Using format=jpg explicitly to ensure proper download
IMAGES_TO_PROCESS = {
    # # EOS 5D Mark IV - ALREADY PROCESSED
    # "eos-5d-mark-iv-front": "https://cdn.media.amplience.net/i/canon/eos-5d-mark-iv-frt-w-ef-50mm_b288dcb709074c41b73639ce141b7c5d.jpg?w=1500",
    # "eos-5d-mark-iv-top": "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-top-w-ef-24-70mm_810a57fdee3e4cc48aff7b5cc1f34b1b.jpg?w=1500",
    # "eos-5d-mark-iv-left": "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-left_a8be5a8bcdba44c795efeaeb9adcc481.jpg?w=1500",
    # "eos-5d-mark-iv-right": "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right_e530e1006fcc4b58b7b63b7df825e1ed.jpg?w=1500",
    
    # EOS Rebel T100 - Scene7 images (add fmt=jpg for proper download)
    "eos-rebel-t100-front-lens": "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_primary?wid=1500&fmt=jpg",
    "eos-rebel-t100-back": "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_back?wid=1500&fmt=jpg",
    "eos-rebel-t100-left": "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_left?wid=1500&fmt=jpg",
    "eos-rebel-t100-top": "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_top?wid=1500&fmt=jpg",
    "eos-rebel-t100-front": "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_front?wid=1500&fmt=jpg",
    "eos-rebel-t100-bottom": "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_bottom?wid=1500&fmt=jpg",
    "eos-rebel-t100-body": "https://s7d1.scene7.com/is/image/canon/2628C001_eos-rebel-t100_primary?wid=1500&fmt=jpg",
}

def download_image(url: str) -> Image.Image:
    """Download image from URL and return PIL Image"""
    print(f"   📥 Downloading: {url[:60]}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))

def remove_background(image: Image.Image) -> Image.Image:
    """Remove background using rembg AI"""
    print("   🔧 Removing background...")
    # Convert to RGBA if needed
    if image.mode != "RGBA":
        image = image.convert("RGBA")
    
    # Remove background
    output = remove(image)
    return output

def process_images():
    """Process all images"""
    print("🚀 Starting background removal process...\n")
    
    processed = []
    failed = []
    
    for name, url in IMAGES_TO_PROCESS.items():
        print(f"\n📷 Processing: {name}")
        try:
            # Download
            img = download_image(url)
            print(f"   ✅ Downloaded: {img.size[0]}x{img.size[1]}")
            
            # Remove background
            transparent_img = remove_background(img)
            
            # Save as PNG
            output_path = OUTPUT_DIR / f"{name}.png"
            transparent_img.save(output_path, "PNG")
            print(f"   ✅ Saved: {output_path}")
            
            processed.append({
                "name": name,
                "original_url": url,
                "local_path": str(output_path),
                "size": transparent_img.size
            })
            
        except Exception as e:
            print(f"   ❌ Failed: {e}")
            failed.append({"name": name, "error": str(e)})
    
    # Summary
    print("\n" + "="*50)
    print(f"✅ Processed: {len(processed)} images")
    if failed:
        print(f"❌ Failed: {len(failed)} images")
        for f in failed:
            print(f"   - {f['name']}: {f['error']}")
    
    print(f"\n📁 Output directory: {OUTPUT_DIR.absolute()}")
    print("\n🔗 Local URLs for use in app:")
    for p in processed:
        print(f"   /images/products-transparent/{p['name']}.png")
    
    return processed

if __name__ == "__main__":
    process_images()
