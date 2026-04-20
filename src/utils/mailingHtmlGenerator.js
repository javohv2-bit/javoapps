/**
 * Mailing HTML Generator
 * 
 * Generates email-compatible HTML for Canon mailings
 * Width: 1200px, Product height: 596px, Divider: 3px
 */

/**
 * Format price with Chilean peso format
 */
const formatPrice = (price) => {
    if (!price) return '';
    return '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Generate product HTML block
 * @param {Object} product - Product data
 * @param {number} index - Position index (for alternating layout)
 * @param {Object} globalColors - Global color settings
 */
const generateProductHtml = (product, index, globalColors = {}) => {
    const isLeft = index % 2 === 0;
    const subtitleBgColor = globalColors.subtitleBgColor || '#cc0000';
    const textColor = globalColors.textColor || '#000000';
    const priceColor = globalColors.priceColor || '#000000';
    
    // Generate product title: logo or text name
    const titleHtml = product.logo_url 
        ? `<img src="${product.logo_url}" alt="${product.name}" style="height: 55px; width: auto; max-width: 100%;" />`
        : `<h2 style="font-size: 28px; font-weight: bold; color: ${textColor}; margin: 0;">${product.name}</h2>`;
    
    // Generate subtitle with colored background pill
    const subtitleHtml = product.subtitle 
        ? `<div style="display: inline-block; background-color: ${subtitleBgColor}; color: white; padding: 8px 20px; border-radius: 18px; font-size: 14px; font-weight: 500; margin-top: 10px; height: 36px; line-height: 20px; box-sizing: border-box;">
            ${product.subtitle}
           </div>`
        : '';

    const imageCell = `
        <td width="600" align="center" valign="middle" style="padding: 20px;">
            <img src="${product.image_url}" alt="${product.name}" style="max-width: 100%; height: auto; max-height: 500px;" />
        </td>
    `;

    const contentCell = `
        <td width="600" valign="middle" style="padding: 30px; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 15px;">
                ${titleHtml}
                ${subtitleHtml}
            </div>
            
            ${product.features && product.features.length > 0 ? `
                <ul style="font-size: 12px; color: ${textColor}; padding-left: 20px; margin: 10px 0;">
                    ${product.features.map(f => `<li style="margin-bottom: 5px;">${f}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${product.discount_percentage ? `
                <div style="display: inline-block; background: #e53935; color: white; padding: 5px 15px; border-radius: 20px; font-size: 18px; font-weight: bold; margin: 10px 0;">
                    ${product.discount_percentage}%
                </div>
            ` : ''}
            
            ${product.price_before ? `
                <p style="font-size: 14px; color: ${priceColor}; opacity: 0.6; text-decoration: line-through; margin: 5px 0;">
                    ${formatPrice(product.price_before)}
                </p>
            ` : ''}
            
            <p style="font-size: 24px; font-weight: bold; color: ${priceColor}; margin: 5px 0;">
                ${formatPrice(product.price_now)}
            </p>
            
            <a href="#" style="display: inline-block; background: #e53935; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: bold; margin-top: 15px;">
                ¡LA QUIERO!
            </a>
        </td>
    `;

    return `
        <tr>
            ${isLeft ? imageCell + contentCell : contentCell + imageCell}
        </tr>
        <tr>
            <td colspan="2" height="3" style="background-color: #e0e0e0;"></td>
        </tr>
    `;
};

/**
 * Generate complete mailing HTML
 */
export const generateMailingHtml = ({
    headerImageUrl,
    bannerImageUrl,
    textContent,
    backgroundImageUrl,
    products = [],
    offerBannerUrl,
    productBackgroundUrl,
    disclaimerText,
    socialNetworks = { facebook: true, instagram: true, youtube: true, twitter: true },
    globalColors = { textColor: '#000000', priceColor: '#000000', subtitleBgColor: '#cc0000' }
}) => {
    const socialIcons = {
        facebook: 'https://cdn-icons-png.flaticon.com/32/733/733547.png',
        instagram: 'https://cdn-icons-png.flaticon.com/32/2111/2111463.png',
        youtube: 'https://cdn-icons-png.flaticon.com/32/1384/1384060.png',
        twitter: 'https://cdn-icons-png.flaticon.com/32/733/733579.png'
    };

    const activeSocials = Object.entries(socialNetworks)
        .filter(([, active]) => active)
        .map(([name]) => `
            <a href="#" style="margin: 0 10px;">
                <img src="${socialIcons[name]}" alt="${name}" width="32" height="32" style="display: inline-block;" />
            </a>
        `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canon Mailing</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center">
                <!-- Main container -->
                <table width="1200" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; ${backgroundImageUrl ? `background-image: url('${backgroundImageUrl}'); background-size: cover; background-position: center;` : ''}">
                    
                    <!-- Header -->
                    ${headerImageUrl ? `
                    <tr>
                        <td colspan="2" align="center">
                            <img src="${headerImageUrl}" alt="Canon" width="1200" style="display: block; max-width: 100%;" />
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Banner Principal -->
                    ${bannerImageUrl ? `
                    <tr>
                        <td colspan="2" align="center">
                            <img src="${bannerImageUrl}" alt="Banner" width="1200" style="display: block; max-width: 100%;" />
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Text Module -->
                    ${textContent ? `
                    <tr>
                        <td colspan="2" align="center" style="padding: 30px 20px; font-family: Arial, sans-serif;">
                            <div style="font-size: 32px; font-weight: bold; color: #e53935;">
                                ${textContent}
                            </div>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Products Section -->
                    ${products.length > 0 ? `
                    <tr>
                        <td colspan="2" style="padding: 0;">
                            <!-- Products Container with Background -->
                            <table width="1200" cellpadding="0" cellspacing="0" border="0" style="${productBackgroundUrl ? `background-image: url('${productBackgroundUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;` : ''}">
                                ${products.map((product, index) => generateProductHtml(product, index, globalColors)).join('')}
                            </table>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Offer Banner -->
                    ${offerBannerUrl ? `
                    <tr>
                        <td colspan="2" align="center" style="padding: 20px 0;">
                            <img src="${offerBannerUrl}" alt="Oferta" width="1200" style="display: block; max-width: 100%;" />
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Social Media Bar -->
                    <tr>
                        <td colspan="2" align="center" style="padding: 20px; background-color: #f8f8f8;">
                            ${activeSocials}
                        </td>
                    </tr>
                    
                    <!-- Disclaimer -->
                    ${disclaimerText ? `
                    <tr>
                        <td colspan="2" style="padding: 20px; font-family: Arial, sans-serif; font-size: 10px; color: #999; text-align: justify; line-height: 1.4;">
                            ${disclaimerText}
                        </td>
                    </tr>
                    ` : ''}
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

/**
 * Download HTML as file
 */
export const downloadMailingHtml = (html, filename = 'mailing.html') => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default {
    generateMailingHtml,
    downloadMailingHtml,
    formatPrice
};
