#!/usr/bin/env python3
"""
Direct Image Downloader for EOS R1
Downloads images directly from Canon Asia CDN
"""

import os
import requests
import hashlib
from urllib.parse import urlparse, unquote
import time

# Output directory
OUTPUT_DIR = "../../../public/images/products/eos-r1"

# Headers to mimic browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://asia.canon/',
}

# EOS R1 images from Canon Asia CDN (verified working URLs)
EOS_R1_IMAGES = {
    'product': [
        # Product angles from Canon Asia
        ('eos-r1_front', 'https://asia.canon/media/image/2024/07/16/f2f3f08189034a76848544428717bb43_EOS+R1+Body+Front.png'),
        ('eos-r1_front_slant', 'https://asia.canon/media/image/2024/07/16/db49fb90f3fb42f1b42bdb6a94d080d3_EOS+R1+Body+Front+Slant.png'),
        ('eos-r1_top', 'https://asia.canon/media/image/2024/07/16/4e305a662c68469fb729498c49d2a327_EOS+R1+Body+Top.png'),
        ('eos-r1_right', 'https://asia.canon/media/image/2024/07/16/d58314a3b5414dfd8fbf91c515f87a67_EOS+R1+Body+Right.png'),
        ('eos-r1_left', 'https://asia.canon/media/image/2024/07/16/e2828a83cdd54ea9a6c922c493ff0809_EOS+R1+Body+Left.png'),
        ('eos-r1_back', 'https://asia.canon/media/image/2024/07/16/889d7dc820b242ea9e9bda3080b8c63f_EOS+R1+Body+Back.png'),
        ('eos-r1_bottom', 'https://asia.canon/media/image/2024/07/16/86d64801b423469e85e8eb98e467cbaa_EOS+R1+Body+Bottom.png'),
    ],
    'features': [
        # Feature images from Canon Asia
        ('eos-r1_accelerated_capture', 'https://asia.canon/media/image/2024/07/12/dae51b609c9049558940c91c001f62de_Accelerated+Capture.jpg'),
        ('eos-r1_pre_continuous', 'https://asia.canon/media/image/2024/07/16/d39e739d2ed64ca5af707ab4cc36a6d7_EOS+R1+Pre-Continuous+Shooting.jpg'),
        ('eos-r1_action_priority_af', 'https://asia.canon/media/image/2024/07/16/bfd5c4e87b884f44a8f5b17156b69fc8_EOS+R1+Action+Priority+AF.jpg'),
    ],
    'scene7': [
        # Scene7 CDN (Canon USA) - verified working
        ('eos-r1_primary', 'https://s7d1.scene7.com/is/image/canon/6577C002_Primary?fmt=png-alpha&wid=1600'),
        ('eos-r1_angle_2', 'https://s7d1.scene7.com/is/image/canon/6577C002_2?fmt=png-alpha&wid=1600'),
        ('eos-r1_angle_3', 'https://s7d1.scene7.com/is/image/canon/6577C002_3?fmt=png-alpha&wid=1600'),
        ('eos-r1_angle_4', 'https://s7d1.scene7.com/is/image/canon/6577C002_4?fmt=png-alpha&wid=1600'),
        ('eos-r1_angle_5', 'https://s7d1.scene7.com/is/image/canon/6577C002_5?fmt=png-alpha&wid=1600'),
    ]
}


def download_image(name, url, output_dir):
    """Download a single image"""
    try:
        print(f"  Downloading: {name}")
        response = requests.get(url, headers=HEADERS, timeout=30)
        
        if response.status_code == 200:
            # Determine extension from URL or content-type
            content_type = response.headers.get('content-type', '')
            if 'png' in content_type or url.endswith('.png') or 'png' in url:
                ext = '.png'
            elif 'webp' in content_type:
                ext = '.webp'
            else:
                ext = '.jpg'
            
            filepath = os.path.join(output_dir, f"{name}{ext}")
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            size_kb = len(response.content) / 1024
            print(f"    ✓ Saved: {name}{ext} ({size_kb:.1f} KB)")
            return True, filepath
        else:
            print(f"    ✗ HTTP {response.status_code}: {url[:60]}...")
            return False, None
            
    except Exception as e:
        print(f"    ✗ Error: {e}")
        return False, None


def main():
    # Create output directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"=" * 60)
    print("EOS R1 Image Downloader - Canon Asia + Scene7")
    print(f"Output directory: {output_dir}")
    print(f"=" * 60)
    
    downloaded = 0
    failed = 0
    downloaded_files = []
    
    # Download from each category
    for category, images in EOS_R1_IMAGES.items():
        print(f"\n📁 Category: {category}")
        for name, url in images:
            success, filepath = download_image(name, url, output_dir)
            if success:
                downloaded += 1
                downloaded_files.append((name, filepath))
            else:
                failed += 1
            time.sleep(0.3)  # Be nice to server
    
    print(f"\n" + "=" * 60)
    print(f"✅ Downloaded: {downloaded} images")
    print(f"❌ Failed: {failed} images")
    print(f"=" * 60)
    
    # List downloaded files
    print(f"\n📂 Files in output directory:")
    for f in sorted(os.listdir(output_dir)):
        filepath = os.path.join(output_dir, f)
        if os.path.isfile(filepath):
            size_kb = os.path.getsize(filepath) / 1024
            print(f"  - {f} ({size_kb:.1f} KB)")
    
    # Generate JSON with local paths for seed script
    print(f"\n📋 Local paths for seed script:")
    print("const EOS_R1_LOCAL_IMAGES = {")
    print("    angles: [")
    for name, _ in EOS_R1_IMAGES.get('product', []):
        print(f'        {{ src: "/images/products/eos-r1/{name}.png", alt: "EOS R1" }},')
    print("    ],")
    print("    features: [")
    for name, _ in EOS_R1_IMAGES.get('features', []):
        ext = '.jpg' if 'jpg' in name or 'feature' in name else '.png'
        print(f'        {{ src: "/images/products/eos-r1/{name}{ext}", alt: "EOS R1 Feature" }},')
    print("    ]")
    print("};")


if __name__ == "__main__":
    main()
