"""
PowerShot Spider - Scrapes Canon PowerShot products
Optimized for extracting ALL images from Canon Asia product pages
"""
import scrapy
import re
import json
from urllib.parse import urljoin, urlparse
from ..items import CanonProductItem


class PowershotSpider(scrapy.Spider):
    name = "powershot"
    allowed_domains = ["asia.canon", "canon.com.sg", "scene7.com", "s7d1.scene7.com"]
    
    # URLs to scrape - add more products as needed
    start_urls = [
        "https://asia.canon/en/consumer/powershot-pick/product",
    ]
    
    def __init__(self, url=None, *args, **kwargs):
        super(PowershotSpider, self).__init__(*args, **kwargs)
        if url:
            self.start_urls = [url]
    
    def parse(self, response):
        """Parse the main product page"""
        item = CanonProductItem()
        item['url'] = response.url
        
        # Extract product name
        item['name'] = self.extract_name(response)
        
        # Extract tagline/headline
        item['tagline'] = self.extract_tagline(response)
        
        # Extract description
        item['description'] = self.extract_description(response)
        
        # Extract ALL images - the main goal
        item['images'] = self.extract_all_images(response)
        
        # Extract specifications
        item['specifications'] = self.extract_specifications(response)
        
        # Extract features
        item['features'] = self.extract_features(response)
        
        # Extract color variants
        item['variants'] = self.extract_variants(response)
        
        yield item
    
    def extract_name(self, response):
        """Extract product name from multiple possible selectors"""
        selectors = [
            'h1.product-name::text',
            'h1::text',
            '.product-title::text',
            '.hero-title::text',
            'meta[property="og:title"]::attr(content)',
            'title::text'
        ]
        for selector in selectors:
            name = response.css(selector).get()
            if name:
                name = name.strip()
                # Clean up title
                name = re.sub(r'\s*[-|]\s*Canon.*$', '', name)
                return name
        return "Unknown Product"
    
    def extract_tagline(self, response):
        """Extract product tagline/subtitle"""
        selectors = [
            '.product-tagline::text',
            '.hero-subtitle::text',
            '.product-subtitle::text',
            'meta[property="og:description"]::attr(content)'
        ]
        for selector in selectors:
            tagline = response.css(selector).get()
            if tagline:
                return tagline.strip()
        return ""
    
    def extract_description(self, response):
        """Extract product description"""
        selectors = [
            '.product-description p::text',
            '.overview-text::text',
            '.product-intro::text',
            '.hero-description::text'
        ]
        descriptions = []
        for selector in selectors:
            texts = response.css(selector).getall()
            descriptions.extend([t.strip() for t in texts if t.strip()])
        return ' '.join(descriptions[:3]) if descriptions else ""
    
    def extract_all_images(self, response):
        """
        Extract ALL images from the page
        This is the key improvement over the Puppeteer approach
        """
        images = {
            'hero': [],
            'angles': [],
            'features': [],
            'lifestyle': [],
            'gallery': [],
            'other': []
        }
        
        # Get all image sources from various elements
        all_image_urls = set()
        
        # 1. Standard img tags
        for img in response.css('img'):
            src = img.attrib.get('src', '')
            data_src = img.attrib.get('data-src', '')
            data_lazy = img.attrib.get('data-lazy-src', '')
            srcset = img.attrib.get('srcset', '')
            
            for url in [src, data_src, data_lazy]:
                if url and self.is_product_image(url):
                    all_image_urls.add(self.clean_image_url(url, response))
            
            # Parse srcset
            if srcset:
                for part in srcset.split(','):
                    url = part.strip().split(' ')[0]
                    if url and self.is_product_image(url):
                        all_image_urls.add(self.clean_image_url(url, response))
        
        # 2. Background images in style attributes
        for element in response.css('[style*="background"]'):
            style = element.attrib.get('style', '')
            urls = re.findall(r'url\(["\']?([^"\')\s]+)["\']?\)', style)
            for url in urls:
                if self.is_product_image(url):
                    all_image_urls.add(self.clean_image_url(url, response))
        
        # 3. Picture sources
        for source in response.css('picture source'):
            srcset = source.attrib.get('srcset', '')
            for part in srcset.split(','):
                url = part.strip().split(' ')[0]
                if url and self.is_product_image(url):
                    all_image_urls.add(self.clean_image_url(url, response))
        
        # 4. Data attributes that might contain image URLs
        for attr_name in ['data-image', 'data-bg', 'data-original', 'data-zoom-image']:
            for element in response.css(f'[{attr_name}]'):
                url = element.attrib.get(attr_name, '')
                if url and self.is_product_image(url):
                    all_image_urls.add(self.clean_image_url(url, response))
        
        # 5. JSON-LD structured data
        for script in response.css('script[type="application/ld+json"]::text').getall():
            try:
                data = json.loads(script)
                self.extract_images_from_json(data, all_image_urls, response)
            except json.JSONDecodeError:
                pass
        
        # 6. Inline scripts that might contain image arrays
        for script in response.css('script:not([src])::text').getall():
            # Look for image URLs in JavaScript
            urls = re.findall(r'["\']([^"\']+\.(?:jpg|jpeg|png|webp)(?:\?[^"\']*)?)["\']', script, re.I)
            for url in urls:
                if self.is_product_image(url):
                    all_image_urls.add(self.clean_image_url(url, response))
        
        # Categorize images
        for url in all_image_urls:
            category = self.categorize_image(url)
            images[category].append(url)
        
        # Sort each category for consistency
        for category in images:
            images[category] = sorted(set(images[category]))
        
        return images
    
    def is_product_image(self, url):
        """Check if URL is a relevant product image"""
        if not url:
            return False
        
        # Skip small icons, logos, social media images
        skip_patterns = [
            r'icon', r'logo', r'sprite', r'social', r'facebook', r'twitter',
            r'instagram', r'youtube', r'tracking', r'analytics', r'pixel',
            r'1x1', r'spacer', r'transparent', r'placeholder'
        ]
        url_lower = url.lower()
        for pattern in skip_patterns:
            if pattern in url_lower:
                return False
        
        # Must be an image file or scene7 URL
        if 'scene7.com' in url:
            return True
        
        if re.search(r'\.(jpg|jpeg|png|webp|gif)(\?|$)', url, re.I):
            return True
        
        return False
    
    def clean_image_url(self, url, response):
        """Clean and normalize image URL"""
        # Make absolute
        url = urljoin(response.url, url)
        
        # For scene7 URLs, request high resolution
        if 'scene7.com' in url:
            # Remove existing size params and set high res
            url = re.sub(r'[?&]wid=\d+', '', url)
            url = re.sub(r'[?&]hei=\d+', '', url)
            separator = '&' if '?' in url else '?'
            url = f"{url}{separator}wid=2000&fmt=png-alpha"
        
        return url
    
    def categorize_image(self, url):
        """Categorize image based on URL patterns"""
        url_lower = url.lower()
        
        if any(x in url_lower for x in ['hero', 'banner', 'main', 'primary']):
            return 'hero'
        elif any(x in url_lower for x in ['angle', 'product', '_front', '_back', '_side', '_top']):
            return 'angles'
        elif any(x in url_lower for x in ['feature', 'benefit', 'highlight']):
            return 'features'
        elif any(x in url_lower for x in ['lifestyle', 'context', 'use', 'shooting']):
            return 'lifestyle'
        elif any(x in url_lower for x in ['gallery', 'sample', 'image_']):
            return 'gallery'
        else:
            return 'other'
    
    def extract_images_from_json(self, data, url_set, response):
        """Recursively extract image URLs from JSON data"""
        if isinstance(data, dict):
            for key, value in data.items():
                if key in ['image', 'url', 'src', 'thumbnail'] and isinstance(value, str):
                    if self.is_product_image(value):
                        url_set.add(self.clean_image_url(value, response))
                elif isinstance(value, (dict, list)):
                    self.extract_images_from_json(value, url_set, response)
        elif isinstance(data, list):
            for item in data:
                self.extract_images_from_json(item, url_set, response)
    
    def extract_specifications(self, response):
        """Extract technical specifications"""
        specs = {}
        
        # Try different table formats
        for row in response.css('.specs-table tr, .specifications tr'):
            key = row.css('th::text, td:first-child::text').get()
            value = row.css('td:last-child::text, td:nth-child(2)::text').get()
            if key and value:
                specs[key.strip()] = value.strip()
        
        # Try definition list format
        for dt in response.css('dl dt'):
            key = dt.css('::text').get()
            dd = dt.xpath('following-sibling::dd[1]')
            value = dd.css('::text').get()
            if key and value:
                specs[key.strip()] = value.strip()
        
        return specs
    
    def extract_features(self, response):
        """Extract product features"""
        features = []
        
        # Look for feature sections
        for feature_el in response.css('.feature, .product-feature, [class*="feature-item"]'):
            title = feature_el.css('h2::text, h3::text, .title::text').get()
            desc = feature_el.css('p::text, .description::text').get()
            img = feature_el.css('img::attr(src), img::attr(data-src)').get()
            
            if title:
                feature = {
                    'title': title.strip(),
                    'description': desc.strip() if desc else '',
                    'image': self.clean_image_url(img, response) if img else ''
                }
                features.append(feature)
        
        return features
    
    def extract_variants(self, response):
        """Extract color/variant options"""
        variants = []
        
        for variant_el in response.css('.color-option, .variant-option, [class*="color-"]'):
            name = variant_el.css('::attr(data-color), ::attr(title), ::text').get()
            img = variant_el.css('img::attr(src)').get()
            
            if name:
                variants.append({
                    'name': name.strip(),
                    'image': self.clean_image_url(img, response) if img else ''
                })
        
        return variants
