"""
EOS R1 Images Spider - Downloads ALL images from Canon USA and Scene7
Uses Scene7 CDN which doesn't have hotlink protection
"""
import scrapy
import re
import json
import os
from urllib.parse import urljoin, urlparse
from ..items import CanonProductItem


class EosR1ImagesSpider(scrapy.Spider):
    name = "eos_r1_images"
    allowed_domains = ["usa.canon.com", "www.usa.canon.com", "scene7.com", "s7d1.scene7.com"]
    
    # Canon USA URLs for EOS R1
    start_urls = [
        "https://www.usa.canon.com/shop/p/eos-r1",
    ]
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 0.5,
        'CONCURRENT_REQUESTS': 4,
        'IMAGES_STORE': '../../../public/images/products/eos-r1',
        'ITEM_PIPELINES': {
            'scrapy.pipelines.images.ImagesPipeline': 1,
            'canon_scraper.pipelines.CanonScraperPipeline': 300,
        },
    }
    
    # Known EOS R1 SKUs and image codes from Canon
    EOS_R1_CODES = [
        '6577C002',  # Main body SKU
    ]
    
    # Scene7 image variations to try
    IMAGE_SUFFIXES = [
        '_Primary',
        '_Sideview',
        '_Topview', 
        '_Rearview',
        '_Angleview',
        '_Front',
        '_Left',
        '_Right',
        '_Top',
        '_Back',
        '_01', '_02', '_03', '_04', '_05',
        '_lifestyle_01', '_lifestyle_02', '_lifestyle_03',
        '_sample_01', '_sample_02', '_sample_03', '_sample_04', '_sample_05',
    ]
    
    def __init__(self, *args, **kwargs):
        super(EosR1ImagesSpider, self).__init__(*args, **kwargs)
        self.collected_images = {
            'product': [],
            'lifestyle': [],
            'samples': [],
            'other': []
        }
        self.image_urls = set()
    
    def parse(self, response):
        """Parse Canon USA product page for images"""
        self.logger.info(f"Parsing: {response.url}")
        
        # Find all Scene7 image URLs in page
        scene7_pattern = r'https?://s7d1\.scene7\.com/is/image/canon/[^"\'\s\)]+?(?=[\"\'\s\)])'
        scene7_urls = re.findall(scene7_pattern, response.text)
        
        for url in scene7_urls:
            # Clean URL
            clean_url = url.split('?')[0]  # Remove query params for base URL
            # Add high quality version
            hq_url = f"{clean_url}?fmt=png-alpha&wid=1600"
            self.image_urls.add(hq_url)
            self.logger.info(f"Found Scene7 image: {clean_url}")
        
        # Also extract from JSON-LD
        json_ld_scripts = response.xpath('//script[@type="application/ld+json"]/text()').getall()
        for script in json_ld_scripts:
            try:
                data = json.loads(script)
                self._extract_images_from_json(data)
            except:
                pass
        
        # Extract from data attributes
        img_urls = response.css('img::attr(src), img::attr(data-src)').getall()
        for url in img_urls:
            if 'scene7' in url.lower() or 'canon' in url.lower():
                clean_url = url.split('?')[0]
                if clean_url.startswith('//'):
                    clean_url = 'https:' + clean_url
                if clean_url.startswith('http'):
                    hq_url = f"{clean_url}?fmt=png-alpha&wid=1600"
                    self.image_urls.add(hq_url)
        
        # Generate additional Scene7 URLs to try
        for code in self.EOS_R1_CODES:
            for suffix in self.IMAGE_SUFFIXES:
                url = f"https://s7d1.scene7.com/is/image/canon/{code}{suffix}?fmt=png-alpha&wid=1600"
                self.image_urls.add(url)
        
        # Also add known EOS R1 sample images from Canon
        sample_images = self._get_known_eos_r1_images()
        self.image_urls.update(sample_images)
        
        # Follow to features/gallery pages
        feature_links = response.css('a[href*="feature"], a[href*="gallery"]::attr(href)').getall()
        for link in feature_links:
            full_url = urljoin(response.url, link)
            yield scrapy.Request(full_url, callback=self.parse_feature_page)
        
        # Create item with all collected images
        yield from self._create_item(response)
    
    def parse_feature_page(self, response):
        """Parse feature/gallery pages for more images"""
        self.logger.info(f"Parsing feature page: {response.url}")
        
        scene7_pattern = r'https?://s7d1\.scene7\.com/is/image/canon/[^"\'\s\)]+?(?=[\"\'\s\)])'
        scene7_urls = re.findall(scene7_pattern, response.text)
        
        for url in scene7_urls:
            clean_url = url.split('?')[0]
            hq_url = f"{clean_url}?fmt=png-alpha&wid=1600"
            self.image_urls.add(hq_url)
    
    def _extract_images_from_json(self, data):
        """Recursively extract images from JSON data"""
        if isinstance(data, dict):
            for key, value in data.items():
                if key in ('image', 'images', 'thumbnail', 'photo'):
                    if isinstance(value, str) and 'scene7' in value.lower():
                        clean = value.split('?')[0]
                        self.image_urls.add(f"{clean}?fmt=png-alpha&wid=1600")
                    elif isinstance(value, list):
                        for v in value:
                            if isinstance(v, str) and 'scene7' in v.lower():
                                clean = v.split('?')[0]
                                self.image_urls.add(f"{clean}?fmt=png-alpha&wid=1600")
                else:
                    self._extract_images_from_json(value)
        elif isinstance(data, list):
            for item in data:
                self._extract_images_from_json(item)
    
    def _get_known_eos_r1_images(self):
        """Return known working EOS R1 image URLs from Scene7"""
        base = "https://s7d1.scene7.com/is/image/canon"
        
        images = [
            # Product shots
            f"{base}/6577C002_Primary?fmt=png-alpha&wid=1600",
            f"{base}/6577C002_1?fmt=png-alpha&wid=1600",
            f"{base}/6577C002_2?fmt=png-alpha&wid=1600",
            f"{base}/6577C002_3?fmt=png-alpha&wid=1600",
            f"{base}/6577C002_4?fmt=png-alpha&wid=1600",
            f"{base}/6577C002_5?fmt=png-alpha&wid=1600",
            # EOS R1 variants
            f"{base}/eos-r1_front?fmt=png-alpha&wid=1600",
            f"{base}/eos-r1_primary?fmt=png-alpha&wid=1600",
            f"{base}/eos-r1_body_primary?fmt=png-alpha&wid=1600",
            f"{base}/eos-r1-body_primary?fmt=png-alpha&wid=1600",
            # With lens
            f"{base}/eos-r1_rf24-105mm?fmt=png-alpha&wid=1600",
            f"{base}/eos-r1-rf-24-105mm?fmt=png-alpha&wid=1600",
        ]
        
        return images
    
    def _create_item(self, response):
        """Create and yield the final item"""
        item = CanonProductItem()
        item['name'] = 'EOS R1'
        item['tagline'] = 'Ahead of the Game'
        item['description'] = 'La cámara flagship profesional de Canon con sensor stacked de 24.2MP.'
        item['url'] = response.url
        
        # Convert set to list for image_urls field
        item['image_urls'] = list(self.image_urls)
        
        # Categorize images
        item['images'] = {
            'product': [u for u in self.image_urls if 'Primary' in u or '_body' in u.lower() or '6577C002' in u],
            'lifestyle': [u for u in self.image_urls if 'lifestyle' in u.lower() or 'sample' in u.lower()],
            'angles': [u for u in self.image_urls if any(x in u.lower() for x in ['side', 'top', 'rear', 'angle', 'front', 'left', 'right', 'back'])],
            'other': []
        }
        
        item['features'] = []
        item['specifications'] = {}
        item['variants'] = []
        
        self.logger.info(f"Total images to download: {len(item['image_urls'])}")
        
        yield item


class EosR1FullSpider(scrapy.Spider):
    """Spider that scrapes Canon USA AND Canon Asia for maximum image coverage"""
    name = "eos_r1_full"
    
    start_urls = [
        "https://www.usa.canon.com/shop/p/eos-r1",
        "https://asia.canon/en/consumer/eos-r1/product",
    ]
    
    allowed_domains = [
        "usa.canon.com", "www.usa.canon.com",
        "asia.canon", "www.asia.canon",
        "scene7.com", "s7d1.scene7.com",
    ]
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 1,
        'CONCURRENT_REQUESTS': 2,
        'IMAGES_STORE': '../../../public/images/products/eos-r1',
        'ITEM_PIPELINES': {
            'scrapy.pipelines.images.ImagesPipeline': 1,
            'canon_scraper.pipelines.CanonScraperPipeline': 300,
        },
    }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.all_images = set()
    
    def parse(self, response):
        """Parse any Canon page for EOS R1 images"""
        self.logger.info(f"Parsing: {response.url}")
        
        # Extract all image URLs
        patterns = [
            r'https?://s7d1\.scene7\.com/is/image/canon/[^"\'\s\)]+',
            r'https?://asia\.canon/media/image/[^"\'\s\)]+',
            r'https?://[^"\'\s\)]*canon[^"\'\s\)]*\.(jpg|jpeg|png|webp)',
        ]
        
        for pattern in patterns:
            urls = re.findall(pattern, response.text, re.IGNORECASE)
            for url in urls:
                if isinstance(url, tuple):
                    continue
                clean_url = url.split('?')[0]
                if 'scene7' in clean_url:
                    clean_url = f"{clean_url}?fmt=png-alpha&wid=1600"
                self.all_images.add(clean_url)
        
        # Create item
        item = CanonProductItem()
        item['name'] = 'EOS R1'
        item['url'] = response.url
        item['image_urls'] = list(self.all_images)
        item['images'] = {'all': list(self.all_images)}
        item['features'] = []
        item['specifications'] = {}
        item['variants'] = []
        
        yield item
