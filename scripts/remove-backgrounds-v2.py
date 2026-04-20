#!/usr/bin/env python3
"""
Remove Background Script v2 - Improved Quality
Uses rembg with post-processing to avoid jagged edges

Features:
- Alpha matting for smooth edges
- Anti-aliasing through gaussian blur on alpha channel
- Higher resolution processing

Usage: python3 scripts/remove-backgrounds-v2.py
"""

import os
import sys
import requests
from io import BytesIO
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image, ImageFilter
    import numpy as np
except ImportError:
    print("❌ Missing dependencies. Install with:")
    print("   pip3 install rembg pillow numpy")
    sys.exit(1)

# Output directory
OUTPUT_DIR = Path("public/images/products-transparent")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Images to process
IMAGES_TO_PROCESS = {
    # EOS 5D Mark IV - reprocess with better quality
    "eos-5d-mark-iv-front": "https://cdn.media.amplience.net/i/canon/eos-5d-mark-iv-frt-w-ef-50mm_b288dcb709074c41b73639ce141b7c5d.jpg?w=2000",
    "eos-5d-mark-iv-top": "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-top-w-ef-24-70mm_810a57fdee3e4cc48aff7b5cc1f34b1b.jpg?w=2000",
    "eos-5d-mark-iv-left": "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-left_a8be5a8bcdba44c795efeaeb9adcc481.jpg?w=2000",
    "eos-5d-mark-iv-right": "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right_e530e1006fcc4b58b7b63b7df825e1ed.jpg?w=2000",
    
    # EOS Rebel T100 - from Canon Peru (better quality)
    "eos-rebel-t100-main": "https://canon.ptmarket.com.pe/pub/media/catalog/product/t/1/t100.jpg",
    "eos-rebel-t100-left": "https://canon.ptmarket.com.pe/pub/media/catalog/product/1/2/12_k422_left_ef-s18-55_is_ii.jpg",
    "eos-rebel-t100-right": "https://canon.ptmarket.com.pe/pub/media/catalog/product/1/1/11_k422_right_ef-s18-55_is_ii.jpg",
}

def download_image(url: str) -> Image.Image:
    """Download image from URL and return PIL Image"""
    print(f"   📥 Downloading...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers, timeout=60)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))

def smooth_alpha_edges(image: Image.Image, blur_radius: int = 2, threshold: int = 10) -> Image.Image:
    """
    Smooth the alpha channel edges to remove jagged artifacts
    
    Args:
        image: RGBA image with alpha channel
        blur_radius: Gaussian blur radius for smoothing
        threshold: Threshold for cleaning up semi-transparent pixels
    """
    if image.mode != "RGBA":
        return image
    
    # Split channels
    r, g, b, a = image.split()
    
    # Convert alpha to numpy for processing
    alpha = np.array(a, dtype=np.float32)
    
    # Apply slight expansion then contraction to fill tiny gaps
    # This helps with the "jagged edge" problem
    
    # Step 1: Gaussian blur the alpha to smooth edges
    a_blurred = a.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    alpha_smooth = np.array(a_blurred, dtype=np.float32)
    
    # Step 2: Threshold to remove very faint semi-transparency (noise)
    # Keep fully opaque pixels, smooth the edges, remove near-transparent noise
    alpha_final = np.where(alpha > 250, 255,  # Keep fully opaque
                   np.where(alpha < threshold, 0,  # Remove noise
                           alpha_smooth))  # Use smoothed for edges
    
    # Step 3: Additional anti-aliasing pass
    a_final = Image.fromarray(alpha_final.astype(np.uint8), mode='L')
    a_final = a_final.filter(ImageFilter.SMOOTH)
    
    # Merge back
    return Image.merge("RGBA", (r, g, b, a_final))

def remove_background_hq(image: Image.Image) -> Image.Image:
    """
    Remove background with high quality settings and post-processing
    """
    print("   🔧 Removing background (HQ mode)...")
    
    # Convert to RGBA if needed
    if image.mode != "RGBA":
        image = image.convert("RGBA")
    
    # Remove background with rembg
    # Using alpha matting for better edge detection
    output = remove(
        image,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10
    )
    
    print("   ✨ Smoothing edges...")
    # Post-process to smooth edges
    output = smooth_alpha_edges(output, blur_radius=1, threshold=15)
    
    return output

def process_images():
    """Process all images"""
    print("🚀 Starting HIGH QUALITY background removal...\n")
    print("   Using alpha matting + edge smoothing for professional results\n")
    
    processed = []
    failed = []
    
    for name, url in IMAGES_TO_PROCESS.items():
        print(f"\n📷 Processing: {name}")
        try:
            # Download
            img = download_image(url)
            print(f"   ✅ Downloaded: {img.size[0]}x{img.size[1]}")
            
            # Remove background with HQ settings
            transparent_img = remove_background_hq(img)
            
            # Save as PNG with high quality
            output_path = OUTPUT_DIR / f"{name}.png"
            transparent_img.save(output_path, "PNG", optimize=True)
            print(f"   ✅ Saved: {output_path}")
            
            processed.append({
                "name": name,
                "local_path": str(output_path),
                "size": transparent_img.size
            })
            
        except Exception as e:
            print(f"   ❌ Failed: {e}")
            failed.append({"name": name, "error": str(e)})
    
    # Summary
    print("\n" + "="*60)
    print(f"✅ Processed: {len(processed)} images (with smooth edges)")
    if failed:
        print(f"❌ Failed: {len(failed)} images")
        for f in failed:
            print(f"   - {f['name']}: {f['error']}")
    
    print(f"\n📁 Output: {OUTPUT_DIR.absolute()}")
    print("\n🔗 Local URLs:")
    for p in processed:
        print(f"   /images/products-transparent/{p['name']}.png")
    
    return processed

if __name__ == "__main__":
    process_images()
