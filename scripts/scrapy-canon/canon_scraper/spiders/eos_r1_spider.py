"""
EOS R1 Spider - Scrapes Canon Asia EOS R1 product page
Optimized for extracting ALL images, features, and specifications
"""
import scrapy
import re
import json
from urllib.parse import urljoin, urlparse
from ..items import CanonProductItem


class EosR1Spider(scrapy.Spider):
    name = "eos_r1"
    allowed_domains = ["canon-europe.com", "www.canon-europe.com", "scene7.com", "s7d1.scene7.com"]
    
    # Canon Europe URLs for EOS R1
    start_urls = [
        "https://www.canon-europe.com/cameras/eos-r1/",
    ]
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 1,
        'CONCURRENT_REQUESTS': 1,
    }
    
    def __init__(self, *args, **kwargs):
        super(EosR1Spider, self).__init__(*args, **kwargs)
        self.all_images = set()
        self.all_features = []
        self.specifications = {}
        self.product_data = {
            'name': 'EOS R1',
            'tagline': '',
            'description': '',
            'images': {
                'hero': [],
                'angles': [],
                'features': [],
                'lifestyle': [],
                'gallery': [],
                'other': []
            },
            'features': [],
            'specifications': {},
            'url': ''
        }
    
    def parse(self, response):
        """Parse each page and aggregate data"""
        self.logger.info(f"Parsing: {response.url}")
        
        # Extract product name
        name = self.extract_name(response)
        if name and name != "Unknown Product":
            self.product_data['name'] = name
        
        # Extract tagline
        tagline = self.extract_tagline(response)
        if tagline:
            self.product_data['tagline'] = tagline
        
        # Extract description
        description = self.extract_description(response)
        if description:
            self.product_data['description'] = description
        
        # Extract ALL images
        images = self.extract_all_images(response)
        for category, urls in images.items():
            self.product_data['images'][category].extend(urls)
        
        # Extract features
        features = self.extract_features(response)
        self.product_data['features'].extend(features)
        
        # Extract specifications
        specs = self.extract_specifications(response)
        self.product_data['specifications'].update(specs)
        
        self.product_data['url'] = response.url
        
        # Create item
        item = CanonProductItem()
        item['name'] = self.product_data['name']
        item['tagline'] = self.product_data['tagline']
        item['description'] = self.product_data['description']
        item['url'] = response.url
        
        # Deduplicate images
        for category in self.product_data['images']:
            self.product_data['images'][category] = list(set(self.product_data['images'][category]))
        
        item['images'] = self.product_data['images']
        
        # Deduplicate features by title
        seen_titles = set()
        unique_features = []
        for f in self.product_data['features']:
            if f.get('title') and f['title'] not in seen_titles:
                seen_titles.add(f['title'])
                unique_features.append(f)
        item['features'] = unique_features
        
        item['specifications'] = self.product_data['specifications']
        item['variants'] = []
        
        yield item
    
    def extract_name(self, response):
        """Extract product name"""
        selectors = [
            'h1.product-name::text',
            'h1::text',
            '.product-title::text',
            '.hero-title::text',
            '.product-hero__title::text',
            'meta[property="og:title"]::attr(content)',
            'title::text'
        ]
        for selector in selectors:
            name = response.css(selector).get()
            if name:
                name = name.strip()
                name = re.sub(r'\s*[-|]\s*Canon.*$', '', name)
                if 'R1' in name.upper():
                    return name
        return "EOS R1"
    
    def extract_tagline(self, response):
        """Extract product tagline/subtitle"""
        selectors = [
            '.product-tagline::text',
            '.hero-subtitle::text',
            '.product-subtitle::text',
            '.product-hero__subtitle::text',
            '.hero__subtitle::text',
            'meta[property="og:description"]::attr(content)'
        ]
        for selector in selectors:
            tagline = response.css(selector).get()
            if tagline:
                return tagline.strip()[:200]
        return ""
    
    def extract_description(self, response):
        """Extract product description"""
        selectors = [
            '.product-description p::text',
            '.overview-text::text',
            '.product-intro::text',
            '.hero-description::text',
            '.product-overview p::text',
            '[class*="description"] p::text',
            '.content-block p::text'
        ]
        descriptions = []
        for selector in selectors:
            texts = response.css(selector).getall()
            descriptions.extend([t.strip() for t in texts if t.strip() and len(t.strip()) > 30])
        return ' '.join(descriptions[:5]) if descriptions else ""
    
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
            data_lazy = img.attrib.get('data-lazy-src', '')
            data_original = img.attrib.get('data-original', '')
            srcset = img.attrib.get('srcset', '')
            
            for url in [src, data_src, data_lazy, data_original]:
                if url and self.is_product_image(url):
                    clean_url = self.clean_image_url(url, response)
                    if clean_url:
                        all_image_urls.add(clean_url)
            
            # Parse srcset
            if srcset:
                for part in srcset.split(','):
                    url = part.strip().split(' ')[0]
                    if url and self.is_product_image(url):
                        clean_url = self.clean_image_url(url, response)
                        if clean_url:
                            all_image_urls.add(clean_url)
        
        # 2. Background images in style attributes
        for element in response.css('[style*="background"]'):
            style = element.attrib.get('style', '')
            urls = re.findall(r'url\(["\']?([^"\')\s]+)["\']?\)', style)
            for url in urls:
                if self.is_product_image(url):
                    clean_url = self.clean_image_url(url, response)
                    if clean_url:
                        all_image_urls.add(clean_url)
        
        # 3. Picture sources
        for source in response.css('picture source'):
            srcset = source.attrib.get('srcset', '')
            for part in srcset.split(','):
                url = part.strip().split(' ')[0]
                if url and self.is_product_image(url):
                    clean_url = self.clean_image_url(url, response)
                    if clean_url:
                        all_image_urls.add(clean_url)
        
        # 4. JSON-LD data
        for script in response.css('script[type="application/ld+json"]::text').getall():
            try:
                data = json.loads(script)
                self.extract_images_from_json(data, all_image_urls, response)
            except:
                pass
        
        # 5. Data attributes that might contain images
        for element in response.css('[data-image], [data-bg], [data-src]'):
            for attr in ['data-image', 'data-bg', 'data-src']:
                url = element.attrib.get(attr, '')
                if url and self.is_product_image(url):
                    clean_url = self.clean_image_url(url, response)
                    if clean_url:
                        all_image_urls.add(clean_url)
        
        # Categorize images
        for url in all_image_urls:
            url_lower = url.lower()
            
            if any(kw in url_lower for kw in ['hero', 'banner', 'main', 'primary', 'header']):
                images['hero'].append(url)
            elif any(kw in url_lower for kw in ['angle', 'front', 'back', 'side', 'top', 'bottom', 'product']):
                images['angles'].append(url)
            elif any(kw in url_lower for kw in ['feature', 'spec', 'detail', 'icon']):
                images['features'].append(url)
            elif any(kw in url_lower for kw in ['lifestyle', 'use', 'action', 'sample', 'shot']):
                images['lifestyle'].append(url)
            elif any(kw in url_lower for kw in ['gallery', 'thumb']):
                images['gallery'].append(url)
            else:
                images['other'].append(url)
        
        return images
    
    def extract_images_from_json(self, data, image_set, response):
        """Recursively extract images from JSON data"""
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, str) and self.is_product_image(value):
                    clean_url = self.clean_image_url(value, response)
                    if clean_url:
                        image_set.add(clean_url)
                else:
                    self.extract_images_from_json(value, image_set, response)
        elif isinstance(data, list):
            for item in data:
                self.extract_images_from_json(item, image_set, response)
    
    def is_product_image(self, url):
        """Check if URL is a relevant product image"""
        if not url:
            return False
        
        url_lower = url.lower()
        
        # Must be an image
        image_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        is_image = any(ext in url_lower for ext in image_extensions) or 'scene7.com' in url_lower
        
        if not is_image:
            return False
        
        # Filter out unwanted images
        exclude_patterns = [
            'icon', 'logo', 'sprite', 'placeholder', 'loading',
            'social', 'facebook', 'twitter', 'instagram', 'youtube',
            'arrow', 'button', 'navigation', 'menu', 'footer',
            'header-bg', 'pattern', '1x1', 'pixel', 'tracking',
            'advertisement', 'banner-ad', 'promo-small'
        ]
        
        if any(pattern in url_lower for pattern in exclude_patterns):
            return False
        
        # Prefer Canon/Scene7 images
        good_domains = ['scene7.com', 'canon', 'asia.canon']
        if any(domain in url_lower for domain in good_domains):
            return True
        
        # Check minimum size indicators
        if 'wid=' in url_lower or 'hei=' in url_lower:
            return True
        
        return True
    
    def clean_image_url(self, url, response):
        """Clean and normalize image URL"""
        if not url:
            return None
        
        # Remove whitespace
        url = url.strip()
        
        # Handle relative URLs
        if url.startswith('//'):
            url = 'https:' + url
        elif url.startswith('/'):
            url = urljoin(response.url, url)
        elif not url.startswith('http'):
            url = urljoin(response.url, url)
        
        # For Scene7 images, request high quality
        if 'scene7.com' in url:
            # Remove existing size params and add high quality ones
            base_url = re.sub(r'\?.*$', '', url)
            url = f"{base_url}?wid=1600&fmt=png-alpha"
        
        return url
    
    def extract_features(self, response):
        """Extract product features"""
        features = []
        
        # Feature sections with title + description
        feature_selectors = [
            '.feature-item',
            '.product-feature',
            '.feature-block',
            '.feature-card',
            '[class*="feature"]',
            '.content-block',
            '.spec-item'
        ]
        
        for selector in feature_selectors:
            for feature in response.css(selector):
                title = feature.css('h2::text, h3::text, h4::text, .title::text, .feature-title::text').get()
                description = feature.css('p::text, .description::text, .feature-description::text').get()
                image = feature.css('img::attr(src), img::attr(data-src)').get()
                
                if title:
                    feature_data = {
                        'title': title.strip(),
                        'description': description.strip() if description else '',
                    }
                    if image and self.is_product_image(image):
                        feature_data['image'] = self.clean_image_url(image, response)
                    features.append(feature_data)
        
        # Also extract from headings followed by paragraphs
        for heading in response.css('h2, h3'):
            title = heading.css('::text').get()
            if title:
                title = title.strip()
                # Get next sibling paragraph
                next_p = heading.xpath('following-sibling::p[1]/text()').get()
                if next_p and len(next_p.strip()) > 20:
                    features.append({
                        'title': title,
                        'description': next_p.strip()
                    })
        
        return features
    
    def extract_specifications(self, response):
        """Extract technical specifications"""
        specs = {}
        
        # Table-based specifications
        for table in response.css('table.specs-table, table.specifications, .spec-table table'):
            current_category = 'General'
            for row in table.css('tr'):
                # Check if header row (category)
                header = row.css('th::text').get()
                if header and not row.css('td'):
                    current_category = header.strip()
                    if current_category not in specs:
                        specs[current_category] = {}
                    continue
                
                # Get key-value pair
                cells = row.css('td::text, th::text').getall()
                if len(cells) >= 2:
                    key = cells[0].strip()
                    value = cells[1].strip()
                    if key and value:
                        if current_category not in specs:
                            specs[current_category] = {}
                        specs[current_category][key] = value
        
        # Definition list based specs
        for dl in response.css('dl.specifications, .spec-list dl'):
            current_category = 'General'
            dts = dl.css('dt')
            dds = dl.css('dd')
            for dt, dd in zip(dts, dds):
                key = dt.css('::text').get()
                value = dd.css('::text').get()
                if key and value:
                    key = key.strip()
                    value = value.strip()
                    if current_category not in specs:
                        specs[current_category] = {}
                    specs[current_category][key] = value
        
        # Div-based specs (common in Canon pages)
        for spec_section in response.css('.specification-section, .spec-category'):
            category_name = spec_section.css('.category-title::text, h3::text, h4::text').get()
            if category_name:
                category_name = category_name.strip()
                if category_name not in specs:
                    specs[category_name] = {}
                
                for item in spec_section.css('.spec-item, .spec-row'):
                    key = item.css('.spec-label::text, .spec-name::text, dt::text').get()
                    value = item.css('.spec-value::text, dd::text').get()
                    if key and value:
                        specs[category_name][key.strip()] = value.strip()
        
        return specs
