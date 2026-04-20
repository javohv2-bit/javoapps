/**
 * Falabella InPage HTML Templates
 * Based on analysis of InPage Builder_v8.xlsx
 * 
 * These templates match EXACTLY what Falabella's system generates.
 * The {placeholders} are replaced with actual data when rendering.
 */

// CSS for Falabella InPage modules - matches their production styles
export const falabellaCSS = `
<style>
  /* Falabella InPage Base Styles */
  .fb-inpage-wrapper {
    max-width: 1160px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    color: #333;
    line-height: 1.5;
  }
  
  .fb-inpage-wrapper img {
    max-width: 100%;
    height: auto;
  }
  
  /* Module separator */
  .separator {
    margin-bottom: 24px;
    padding-bottom: 24px;
  }
  
  /* Module 1 & 9: Banner header */
  .fb-product-information-tab__header {
    text-align: center;
  }
  
  .fb-product-information-tab__header img {
    width: 100%;
    max-width: 1160px;
    height: auto;
  }
  
  /* Module 2 & 5: Two column text/list */
  .fb-product-information-tab__text {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 24px;
  }
  
  .fb-product-information-tab__text-first,
  .fb-product-information-tab__text-second {
    flex: 1;
    min-width: 280px;
  }
  
  /* Module 3 & 4: Picture with text */
  .fb-product-information-tab__picture-text {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
    padding: 24px 0;
  }
  
  .fb-product-information-tab__picture-text-first,
  .fb-product-information-tab__picture-text-second {
    flex: 1;
    min-width: 280px;
  }
  
  .fb-product-information-tab__picture-text-first img,
  .fb-product-information-tab__picture-text-second img {
    width: 100%;
    max-width: 560px;
    height: auto;
    border-radius: 4px;
  }
  
  /* Module 4: Text left, image right */
  .fb-product-information-tab__picture-text-first.orderFix {
    order: 1;
  }
  
  .fb-product-information-tab__picture-text-second.orderFix {
    order: 2;
  }
  
  @media (min-width: 768px) {
    .fb-product-information-tab__picture-text-first.orderFix {
      order: 1;
    }
    .fb-product-information-tab__picture-text-second.orderFix {
      order: 2;
    }
  }
  
  /* Module 6: Banner with text below */
  .fb-product-information-tab__banner {
    text-align: center;
    padding: 24px 0;
  }
  
  .fb-product-information-tab__banner img {
    width: 100%;
    max-width: 1160px;
    height: auto;
    margin-bottom: 16px;
  }
  
  /* Module 7: Two pictures with text */
  .fb-product-information-tab__pictures {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 24px 0;
  }
  
  .fb-product-information-tab__pictures-first,
  .fb-product-information-tab__pictures-second {
    flex: 1;
    min-width: 280px;
    text-align: center;
  }
  
  .fb-product-information-tab__pictures-first img,
  .fb-product-information-tab__pictures-second img {
    width: 100%;
    max-width: 560px;
    height: auto;
    margin-bottom: 12px;
    border-radius: 4px;
  }
  
  /* Module 8: Video with text */
  .fb-product-information-tab__video {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 24px 0;
    align-items: center;
  }
  
  .fb-product-information-tab__video-iframe {
    flex: 1;
    min-width: 280px;
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
  }
  
  .fb-product-information-tab__video-iframe iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  
  .fb-product-information-tab__video-text {
    flex: 1;
    min-width: 280px;
  }
  
  /* Typography - Falabella classes */
  .fb-cpy-bold {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }
  
  .fb-cpy-small {
    font-size: 0.875rem;
    color: #555;
    line-height: 1.6;
  }
  
  /* List styles */
  .fb-list {
    list-style: disc;
    padding-left: 20px;
    margin: 0;
  }
  
  .fb-list li {
    margin-bottom: 4px;
  }
  
  /* Banner clickeable */
  .fb-product-information-tab__header a {
    display: block;
  }
  
  .fb-product-information-tab__header a img {
    transition: opacity 0.2s;
  }
  
  .fb-product-information-tab__header a:hover img {
    opacity: 0.9;
  }
</style>
`;

// HTML wrapper that surrounds all modules
export const wrapperOpen = '<div class="fb-inpage-wrapper">';
export const wrapperClose = '</div>';

/**
 * Module HTML templates - exact match to Falabella's Excel formulas
 * Placeholders use {fieldName} format
 */
export const moduleTemplates = {
    // Module 1: Banner principal sin texto (1160x480)
    1: `<div class="fb-product-information-tab__header separator">
  <img src="{imageSrc}" width="1160" height="480" alt="{altImage}">
</div>`,

    // Module 2: Texto en dos columnas (sin imagen)
    2: `<div class="fb-product-information-tab__text separator">
  <div class="fb-product-information-tab__text-first">
    <h3 class="fb-cpy-bold">{title}</h3>
    <p class="fb-cpy-small">{col1Text}</p>
  </div>
  <div class="fb-product-information-tab__text-second">
    <h3 class="fb-cpy-bold">&nbsp;</h3>
    <p class="fb-cpy-small">{col2Text}</p>
  </div>
</div>`,

    // Module 3: Imagen y Texto (560x315)
    3: `<div class="fb-product-information-tab__picture-text separator">
  <div class="fb-product-information-tab__picture-text-first">
    <img src="{imageSrc}" width="560" height="315" alt="{altImage}">
  </div>
  <div class="fb-product-information-tab__picture-text-second">
    <h3 class="fb-cpy-bold">{title}</h3>
    <p class="fb-cpy-small">{description}</p>
  </div>
</div>`,

    // Module 4: Texto e Imagen (560x315) - order reversed
    4: `<div class="fb-product-information-tab__picture-text separator">
  <div class="fb-product-information-tab__picture-text-first orderFix">
    <h3 class="fb-cpy-bold">{title}</h3>
    <p class="fb-cpy-small">{description}</p>
  </div>
  <div class="fb-product-information-tab__picture-text-second orderFix">
    <img src="{imageSrc}" width="560" height="315" alt="{altImage}">
  </div>
</div>`,

    // Module 5: Lista en dos columnas (sin imagen)
    5: `<div class="fb-product-information-tab__text separator">
  <div class="fb-product-information-tab__text-first">
    <h3 class="fb-cpy-bold">{title}</h3>
    <ul class="fb-cpy-small fb-list">
      <li>{item1}</li>
      <li>{item2}</li>
      <li>{item3}</li>
      <li>{item4}</li>
    </ul>
  </div>
  <div class="fb-product-information-tab__text-second">
    <h3 class="fb-cpy-bold">&nbsp;</h3>
    <ul class="fb-cpy-small fb-list">
      <li>{item5}</li>
      <li>{item6}</li>
      <li>{item7}</li>
      <li>{item8}</li>
    </ul>
  </div>
</div>`,

    // Module 6: Banner grande y texto (1160x360)
    6: `<div class="fb-product-information-tab__banner separator">
  <img src="{imageSrc}" width="1160" height="360" alt="{altImage}">
  <h3 class="fb-cpy-bold">{title}</h3>
  <p class="fb-cpy-small">{description}</p>
</div>`,

    // Module 7: Dos imágenes con texto (560x315 cada una)
    7: `<div class="fb-product-information-tab__pictures separator">
  <div class="fb-product-information-tab__pictures-first">
    <img src="{leftImageSrc}" width="560" height="315" alt="{leftAlt}">
    <h3 class="fb-cpy-bold">{leftTitle}</h3>
    <p class="fb-cpy-small">{leftText}</p>
  </div>
  <div class="fb-product-information-tab__pictures-second">
    <img src="{rightImageSrc}" width="560" height="315" alt="{rightAlt}">
    <h3 class="fb-cpy-bold">{rightTitle}</h3>
    <p class="fb-cpy-small">{rightText}</p>
  </div>
</div>`,

    // Module 8: Video y texto (sin imagen)
    8: `<div class="fb-product-information-tab__video separator">
  <div class="fb-product-information-tab__video-iframe">
    <iframe src="https://www.youtube.com/embed/{youtubeCode}" frameborder="0" allowfullscreen></iframe>
  </div>
  <div class="fb-product-information-tab__video-text">
    <h3 class="fb-cpy-bold">{title}</h3>
    <p class="fb-cpy-small">{description}</p>
  </div>
</div>`,

    // Module 9: Banner clickeable (1160x480)
    9: `<div class="fb-product-information-tab__header separator">
  <a href="{url}" target="_blank" rel="noopener noreferrer">
    <img src="{imageSrc}" width="1160" height="480" alt="{altImage}">
  </a>
</div>`
};

/**
 * Generate HTML for a single block using Falabella's exact template
 * @param {number} moduleId - The module ID (1-9)
 * @param {Object} data - Block data with field values
 * @param {Object} imageSources - Map of field names to actual image URLs
 * @returns {string} Generated HTML
 */
export const generateBlockHtml = (moduleId, data, imageSources = {}) => {
    let template = moduleTemplates[moduleId];
    if (!template) return '';

    // Replace all placeholders with actual data
    let html = template;

    // Handle image sources specially
    if (imageSources.image) {
        html = html.replace('{imageSrc}', imageSources.image);
    }
    if (imageSources.leftImage) {
        html = html.replace('{leftImageSrc}', imageSources.leftImage);
    }
    if (imageSources.rightImage) {
        html = html.replace('{rightImageSrc}', imageSources.rightImage);
    }

    // Replace other placeholders from data
    Object.entries(data).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        // Don't replace if it's an image field (handled separately)
        if (!['image', 'leftImage', 'rightImage'].includes(key)) {
            html = html.replaceAll(placeholder, value || '');
        }
    });

    // Clean up any remaining empty placeholders
    html = html.replace(/\{[^}]+\}/g, '');

    // Remove empty list items
    html = html.replace(/<li>\s*<\/li>/g, '');

    return html;
};

/**
 * Generate complete InPage HTML
 * @param {Array} blocks - Array of block objects
 * @param {Function} getImageSrc - Function to resolve image sources
 * @returns {string} Complete HTML for the InPage
 */
export const generateFullInPageHtml = (blocks, getImageSrc) => {
    const blockHtmls = blocks.map(block => {
        const imageSources = {};
        
        // Get image sources for this block
        if (block.data.image) {
            imageSources.image = getImageSrc(block.data.image);
        }
        if (block.data.leftImage) {
            imageSources.leftImage = getImageSrc(block.data.leftImage);
        }
        if (block.data.rightImage) {
            imageSources.rightImage = getImageSrc(block.data.rightImage);
        }

        return generateBlockHtml(block.moduleId, block.data, imageSources);
    });

    return `${falabellaCSS}
${wrapperOpen}
${blockHtmls.join('\n')}
${wrapperClose}`;
};
