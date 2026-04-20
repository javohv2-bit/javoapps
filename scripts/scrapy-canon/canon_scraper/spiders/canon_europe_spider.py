"""
Canon Europe Spider - Scrapes Canon Europe product pages
Optimized for extracting products like EOS 5D Mark IV
"""
import scrapy
import re
import json
from urllib.parse import urljoin, urlparse
from ..items import CanonProductItem


class CanonEuropeSpider(scrapy.Spider):
    name = "canon_europe"
    allowed_domains = ["canon-europe.com", "canon.co.uk", "scene7.com", "s7d1.scene7.com"]
    
    start_urls = [
        "https://www.canon-europe.com/cameras/eos-5d-mark-iv/",
    ]
    
    def __init__(self, url=None, *args, **kwargs):
        super(CanonEuropeSpider, self).__init__(*args, **kwargs)
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
        
        # Extract ALL images
        item['images'] = self.extract_all_images(response)
        
        # Extract specifications
        item['specifications'] = self.extract_specifications(response)
        
        # Extract features
        item['features'] = self.extract_features(response)
        
        # Extract color variants
        item['variants'] = []
        
        yield item
        
        # Follow links to specifications page if exists
        specs_link = response.css('a[href*="specifications"]::attr(href)').get()
        if specs_link:
            yield response.follow(specs_link, callback=self.parse_specifications_page, meta={'item': item})
        
        # Follow links to features page
        features_link = response.css('a[href*="features"]::attr(href)').get()
        if features_link:
            yield response.follow(features_link, callback=self.parse_features_page, meta={'item': item})
    
    def extract_name(self, response):
        """Extract product name"""
        selectors = [
            'h1::text',
            '.product-name::text',
            '.hero__title::text',
            '.product-hero__title::text',
            'meta[property="og:title"]::attr(content)',
            'title::text'
        ]
        for selector in selectors:
            name = response.css(selector).get()
            if name:
                name = name.strip()
                # Clean up
                name = re.sub(r'\s*[-|].*Canon.*$', '', name, flags=re.I)
                return name
        return "Unknown Product"
    
    def extract_tagline(self, response):
        """Extract product tagline"""
        selectors = [
            '.hero__subtitle::text',
            '.product-hero__subtitle::text',
            '.product-tagline::text',
            'meta[name="description"]::attr(content)'
        ]
        for selector in selectors:
            tagline = response.css(selector).get()
            if tagline:
                return tagline.strip()[:200]  # Limit length
        return ""
    
    def extract_description(self, response):
        """Extract product description"""
        selectors = [
            '.product-description p::text',
            '.product-intro p::text',
            '.overview__text::text',
            '.hero__description::text',
            '[class*="description"] p::text'
        ]
        descriptions = []
        for selector in selectors:
            texts = response.css(selector).getall()
            descriptions.extend([t.strip() for t in texts if t.strip() and len(t.strip()) > 20])
        return ' '.join(descriptions[:3]) if descriptions else ""
    
    def extract_all_images(self, response):
        """Extract ALL images from the page"""
        images = {
            'hero': [],
            'angles': [],
            'features': [],
            'lifestyle': [],
            'gallery': [],
            'other': []
        }
        
        all_image_urls = set()
        
        # 1. Standard img tags
        for img in response.css('img'):
            src = img.attrib.get('src', '')
            data_src = img.attrib.get('data-src', '')
            data_lazy = img.attrib.get('data-lazy', '')
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
        
        # 2. Background images
        for element in response.css('[style*="background"]'):
            style = element.attrib.get('style', '')
            urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', style)
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
        
        # 4. Data attributes
        for attr_name in ['data-image', 'data-bg', 'data-original', 'data-zoom-image', 'data-lg-src']:
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
        
        # 6. Inline scripts with image arrays
        for script in response.css('script:not([src])::text').getall():
            urls = re.findall(r'["\'](https?://[^"\']+\.(?:jpg|jpeg|png|webp)(?:\?[^"\']*)?)["\']', script, re.I)
            for url in urls:
                if self.is_product_image(url):
                    all_image_urls.add(self.clean_image_url(url, response))
        
        # 7. Canon Europe specific: media library URLs
        for url in re.findall(r'["\'](/-/media/[^"\']+\.(?:jpg|jpeg|png|webp)[^"\']*)["\']', response.text, re.I):
            full_url = urljoin(response.url, url)
            if self.is_product_image(full_url):
                all_image_urls.add(full_url)
        
        # 8. Scene7 specific patterns for Canon
        for match in re.findall(r'(https?://[^"\']+scene7\.com/is/image/canon/[^"\'\s?]+)', response.text, re.I):
            clean_url = self.clean_image_url(match, response)
            all_image_urls.add(clean_url)
        
        # Categorize images
        for url in all_image_urls:
            category = self.categorize_image(url)
            images[category].append(url)
        
        # Sort for consistency
        for category in images:
            images[category] = sorted(set(images[category]))
        
        return images
    
    def is_product_image(self, url):
        """Check if URL is a relevant product image"""
        if not url:
            return False
        
        # Skip small assets
        skip_patterns = [
            r'icon', r'logo', r'sprite', r'social', r'facebook', r'twitter',
            r'instagram', r'youtube', r'tracking', r'analytics', r'pixel',
            r'1x1', r'spacer', r'transparent', r'placeholder', r'arrow',
            r'button', r'nav', r'menu', r'footer', r'header-bg', r'share'
        ]
        url_lower = url.lower()
        for pattern in skip_patterns:
            if pattern in url_lower:
                return False
        
        # Must be an image
        if 'scene7.com' in url:
            return True
        
        if '/-/media/' in url:  # Canon Europe media path
            return True
        
        if re.search(r'\.(jpg|jpeg|png|webp|gif)(\?|$)', url, re.I):
            return True
        
        return False
    
    def clean_image_url(self, url, response):
        """Clean and normalize image URL"""
        url = urljoin(response.url, url)
        
        # For scene7, request high resolution
        if 'scene7.com' in url:
            url = re.sub(r'[?&]wid=\d+', '', url)
            url = re.sub(r'[?&]hei=\d+', '', url)
            separator = '&' if '?' in url else '?'
            url = f"{url}{separator}wid=2000&fmt=png-alpha"
        
        # For Canon Europe media, try to get larger version
        if '/-/media/' in url and '?w=' not in url:
            separator = '&' if '?' in url else '?'
            url = f"{url}{separator}w=2000"
        
        return url
    
    def categorize_image(self, url):
        """Categorize image based on URL patterns"""
        url_lower = url.lower()
        
        # Hero/Banner images
        if any(x in url_lower for x in ['hero', 'banner', 'main', 'primary', 'header']):
            return 'hero'
        
        # Product angles
        if any(x in url_lower for x in ['front', 'back', 'side', 'top', 'bottom', 'angle', 'body']):
            return 'angles'
        
        # Feature images
        if any(x in url_lower for x in ['feature', 'benefit', 'highlight', 'capability']):
            return 'features'
        
        # Lifestyle/usage images
        if any(x in url_lower for x in ['lifestyle', 'context', 'use', 'shooting', 'photographer', 'action']):
            return 'lifestyle'
        
        # Gallery/sample images
        if any(x in url_lower for x in ['gallery', 'sample', 'example', 'image_']):
            return 'gallery'
        
        # Default
        return 'other'
    
    def extract_images_from_json(self, data, url_set, response):
        """Recursively extract image URLs from JSON data"""
        if isinstance(data, dict):
            for key, value in data.items():
                if key in ['image', 'url', 'src', 'thumbnail', 'contentUrl'] and isinstance(value, str):
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
        
        # Canon Europe uses various formats
        # Try definition lists
        for dl in response.css('dl'):
            dts = dl.css('dt')
            dds = dl.css('dd')
            for dt, dd in zip(dts, dds):
                key = dt.css('::text').get()
                value = dd.css('::text').get()
                if key and value:
                    specs[key.strip()] = value.strip()
        
        # Try tables
        for row in response.css('table tr'):
            cells = row.css('td')
            if len(cells) >= 2:
                key = cells[0].css('::text').get()
                value = cells[1].css('::text').get()
                if key and value:
                    specs[key.strip()] = value.strip()
        
        # Try key-value pairs
        for item in response.css('[class*="spec-item"], [class*="specification"]'):
            key = item.css('.spec-label::text, .key::text, dt::text').get()
            value = item.css('.spec-value::text, .value::text, dd::text').get()
            if key and value:
                specs[key.strip()] = value.strip()
        
        return specs
    
    def extract_features(self, response):
        """Extract product features"""
        features = []
        
        # Look for feature cards/sections
        for feature_el in response.css('[class*="feature"], [class*="benefit"], .card'):
            title = feature_el.css('h2::text, h3::text, h4::text, .title::text').get()
            desc = feature_el.css('p::text, .description::text, .text::text').get()
            img = feature_el.css('img::attr(src), img::attr(data-src)').get()
            
            if title and len(title.strip()) > 2:
                feature = {
                    'title': title.strip(),
                    'description': desc.strip() if desc else '',
                    'image': self.clean_image_url(img, response) if img else ''
                }
                features.append(feature)
        
        return features
    
    def parse_specifications_page(self, response):
        """Parse specifications subpage"""
        item = response.meta.get('item')
        if item:
            specs = self.extract_specifications(response)
            existing_specs = item.get('specifications', {})
            existing_specs.update(specs)
            item['specifications'] = existing_specs
            yield item
    
    def parse_features_page(self, response):
        """Parse features subpage"""
        item = response.meta.get('item')
        if item:
            features = self.extract_features(response)
            existing_features = item.get('features', [])
            existing_features.extend(features)
            item['features'] = existing_features
            
            # Also extract more images from features page
            images = self.extract_all_images(response)
            existing_images = item.get('images', {})
            for category in images:
                if category not in existing_images:
                    existing_images[category] = []
                existing_images[category].extend(images[category])
                existing_images[category] = list(set(existing_images[category]))
            item['images'] = existing_images
            
            yield item
