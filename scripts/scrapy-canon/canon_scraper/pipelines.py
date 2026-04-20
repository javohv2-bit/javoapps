"""
Scrapy Pipelines for Canon Product Scraping
"""
import json
import os
from datetime import datetime
from itemadapter import ItemAdapter
from scrapy.pipelines.images import ImagesPipeline
from scrapy import Request
import hashlib


class CanonImagesPipeline(ImagesPipeline):
    """Custom Images Pipeline with proper headers for Canon CDN"""
    
    def get_media_requests(self, item, info):
        adapter = ItemAdapter(item)
        for image_url in adapter.get('image_urls', []):
            # Add referer header to bypass hotlink protection
            yield Request(
                image_url, 
                meta={
                    'image_name': self._get_image_name(image_url),
                    'original_url': image_url
                },
                headers={
                    'Referer': 'https://www.canon-europe.com/',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                }
            )
    
    def _get_image_name(self, url):
        """Generate clean filename from URL"""
        # Extract meaningful name from Canon URLs
        if 'canon/' in url:
            name = url.split('canon/')[-1].split('?')[0]
            return name.replace('/', '_')
        return hashlib.md5(url.encode()).hexdigest()
    
    def file_path(self, request, response=None, info=None, *, item=None):
        """Custom file path with meaningful names"""
        image_name = request.meta.get('image_name', '')
        if not image_name:
            image_name = hashlib.md5(request.url.encode()).hexdigest()
        
        # Ensure .jpg extension
        if not image_name.endswith(('.jpg', '.jpeg', '.png', '.webp')):
            image_name += '.jpg'
        
        return f'full/{image_name}'


class CanonScraperPipeline:
    """Pipeline to process and save scraped items"""
    
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Add timestamp
        adapter['scrape_timestamp'] = datetime.now().isoformat()
        
        # Count total images
        images = adapter.get('images', {})
        total = 0
        for category, urls in images.items():
            if isinstance(urls, list):
                total += len(urls)
        adapter['total_images'] = total
        
        # Map downloaded images to local paths
        downloaded = adapter.get('downloaded_images', [])
        if downloaded:
            adapter['local_images'] = [
                f"/images/products/eos-r1/full/{img['path'].split('/')[-1]}" 
                for img in downloaded if img.get('path')
            ]
            spider.logger.info(f"Downloaded {len(downloaded)} images")
        
        return item
