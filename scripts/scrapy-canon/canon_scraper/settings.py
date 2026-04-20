# Scrapy settings for canon_scraper project

BOT_NAME = "canon_scraper"

SPIDER_MODULES = ["canon_scraper.spiders"]
NEWSPIDER_MODULE = "canon_scraper.spiders"

# Crawl responsibly by identifying yourself
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests
CONCURRENT_REQUESTS = 2

# Configure a delay for requests
DOWNLOAD_DELAY = 1

# Enable or disable cookies
COOKIES_ENABLED = True

# Override the default request headers
DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.canon-europe.com/",
}

# Configure item pipelines
ITEM_PIPELINES = {
    "scrapy.pipelines.images.ImagesPipeline": 1,
    "canon_scraper.pipelines.CanonScraperPipeline": 300,
}

# Images Pipeline Configuration
IMAGES_STORE = '../../../public/images/products/eos-r1'
IMAGES_URLS_FIELD = 'image_urls'
IMAGES_RESULT_FIELD = 'downloaded_images'
IMAGES_EXPIRES = 90

# Image download settings - bypass hotlink protection
MEDIA_ALLOW_REDIRECTS = True

# Set settings whose default value is deprecated
REQUEST_FINGERPRINTER_IMPLEMENTATION = "2.7"
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"

# Logging
LOG_LEVEL = "INFO"
