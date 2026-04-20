"""
Scrapy Items for Canon Product Scraping
"""
import scrapy


class CanonProductItem(scrapy.Item):
    """Item for storing scraped Canon product data"""
    
    # Basic info
    name = scrapy.Field()
    tagline = scrapy.Field()
    description = scrapy.Field()
    url = scrapy.Field()
    
    # Images categorized
    images = scrapy.Field()  # Dict with hero, angles, features, lifestyle, other
    
    # For ImagesPipeline
    image_urls = scrapy.Field()  # List of all image URLs to download
    downloaded_images = scrapy.Field()  # Results from ImagesPipeline
    local_images = scrapy.Field()  # Local paths after download
    
    # Specifications
    specifications = scrapy.Field()  # Dict of spec name -> value
    
    # Features
    features = scrapy.Field()  # List of {title, description, image}
    
    # Variants/Colors
    variants = scrapy.Field()  # List of color variants with images
    
    # Metadata
    scrape_timestamp = scrapy.Field()
    total_images = scrapy.Field()
