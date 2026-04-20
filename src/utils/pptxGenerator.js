/**
 * PowerPoint generator utility.
 * Focuses on fidelity between web preview and exported .pptx.
 */
import pptxgenjs from 'pptxgenjs';

/**
 * 16:9 standard wide slide (inches).
 * Matches PptxGenJS `LAYOUT_WIDE`.
 */
const SLIDE_WIDTH_INCHES = 13.333;
const SLIDE_HEIGHT_INCHES = 7.5;
const PX_TO_POINTS = 0.75;

const assetDataUrlCache = new Map();
const imageMetaCache = new Map();
const filteredImageCache = new Map();

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function round(value, precision = 4) {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
}

function normalizeHexColor(color, fallback = '000000') {
    if (!color || typeof color !== 'string') return fallback;
    return color.replace('#', '').trim() || fallback;
}

function isDataLikeUrl(value) {
    return typeof value === 'string' && (value.startsWith('data:') || value.startsWith('blob:'));
}

function percentToInches(percentX, percentY, percentW, percentH) {
    const safeW = clamp(Number(percentW) || 0, 0, 100);
    const safeH = clamp(Number(percentH) || 0, 0, 100);
    const safeX = clamp(Number(percentX) || 0, 0, 100 - safeW);
    const safeY = clamp(Number(percentY) || 0, 0, 100 - safeH);

    return {
        x: round((safeX / 100) * SLIDE_WIDTH_INCHES),
        y: round((safeY / 100) * SLIDE_HEIGHT_INCHES),
        w: round((safeW / 100) * SLIDE_WIDTH_INCHES),
        h: round((safeH / 100) * SLIDE_HEIGHT_INCHES)
    };
}

function calculateContainFit(containerW, containerH, aspectRatio) {
    if (!aspectRatio || aspectRatio <= 0) {
        return { x: 0, y: 0, w: containerW, h: containerH };
    }

    const containerRatio = containerW / containerH;
    if (aspectRatio > containerRatio) {
        const h = containerW / aspectRatio;
        return { x: 0, y: (containerH - h) / 2, w: containerW, h };
    }

    const w = containerH * aspectRatio;
    return { x: (containerW - w) / 2, y: 0, w, h: containerH };
}

function fileExtFromMimeType(mimeType) {
    if (!mimeType || typeof mimeType !== 'string') return '';
    const normalized = mimeType.toLowerCase();
    if (normalized.includes('mp4')) return 'mp4';
    if (normalized.includes('quicktime')) return 'mov';
    if (normalized.includes('x-m4v') || normalized.includes('m4v')) return 'm4v';
    if (normalized.includes('webm')) return 'webm';
    if (normalized.includes('ogg')) return 'ogg';
    if (normalized.includes('mpeg')) return 'mpeg';
    return '';
}

function calculateCoverFit(containerW, containerH, aspectRatio) {
    if (!aspectRatio || aspectRatio <= 0) {
        return { x: 0, y: 0, w: containerW, h: containerH };
    }

    const containerRatio = containerW / containerH;
    if (aspectRatio > containerRatio) {
        const w = containerH * aspectRatio;
        return { x: (containerW - w) / 2, y: 0, w, h: containerH };
    }

    const h = containerW / aspectRatio;
    return { x: 0, y: (containerH - h) / 2, w: containerW, h };
}

function parseWhiteFilter(filter) {
    if (!filter || typeof filter !== 'string') return null;
    const normalized = filter.toLowerCase();
    const hasWhiteTransform = normalized.includes('brightness(0)') && normalized.includes('invert(1)');
    if (!hasWhiteTransform) return null;

    let opacity = 1;
    const opacityMatch = normalized.match(/opacity\(([^)]+)\)/);
    if (opacityMatch?.[1]) {
        const rawValue = opacityMatch[1].trim();
        if (rawValue.endsWith('%')) {
            const parsed = Number.parseFloat(rawValue.slice(0, -1));
            if (Number.isFinite(parsed)) opacity = clamp(parsed / 100, 0, 1);
        } else {
            const parsed = Number.parseFloat(rawValue);
            if (Number.isFinite(parsed)) opacity = clamp(parsed, 0, 1);
        }
    }

    return { mode: 'white', opacity };
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function assetToDataUrl(assetPath) {
    if (!assetPath || typeof assetPath !== 'string') return null;
    if (assetDataUrlCache.has(assetPath)) return assetDataUrlCache.get(assetPath);
    if (assetPath.startsWith('data:')) {
        assetDataUrlCache.set(assetPath, assetPath);
        return assetPath;
    }

    try {
        const resolved = assetPath.startsWith('/') && typeof window !== 'undefined'
            ? `${window.location.origin}${assetPath}`
            : assetPath;

        const response = await fetch(resolved);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const dataUrl = await blobToDataUrl(blob);
        assetDataUrlCache.set(assetPath, dataUrl);
        return dataUrl;
    } catch (err) {
        console.warn('Could not load asset:', assetPath, err);
        return null;
    }
}

function loadImageMeta(imageSource) {
    if (!imageSource || typeof imageSource !== 'string') {
        return Promise.resolve({ width: 0, height: 0, aspectRatio: null });
    }
    if (imageMetaCache.has(imageSource)) return imageMetaCache.get(imageSource);

    const metaPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const width = img.naturalWidth || img.width || 0;
            const height = img.naturalHeight || img.height || 0;
            resolve({
                width,
                height,
                aspectRatio: width > 0 && height > 0 ? width / height : null
            });
        };
        img.onerror = () => resolve({ width: 0, height: 0, aspectRatio: null });
        img.src = imageSource;
    });

    imageMetaCache.set(imageSource, metaPromise);
    return metaPromise;
}

async function applyWhiteFilter(imageData, opacity = 1) {
    const cacheKey = `${imageData}|white|${opacity}`;
    if (filteredImageCache.has(cacheKey)) return filteredImageCache.get(cacheKey);

    const filteredPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(imageData);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.globalAlpha = clamp(opacity, 0, 1);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(imageData);
        img.src = imageData;
    });

    filteredImageCache.set(cacheKey, filteredPromise);
    return filteredPromise;
}

async function prepareImageData(imageSource, filter) {
    let imageData = imageSource;
    if (!imageData) return null;

    if (!isDataLikeUrl(imageData)) {
        imageData = await assetToDataUrl(imageData);
    }
    if (!imageData) return null;

    const whiteFilter = parseWhiteFilter(filter);
    if (whiteFilter?.mode === 'white') {
        imageData = await applyWhiteFilter(imageData, whiteFilter.opacity);
    }

    return imageData;
}

async function addBackground(slide, pptSlide) {
    const bgColor = normalizeHexColor(slide.backgroundColor, 'FFFFFF');
    pptSlide.background = { color: bgColor };

    if (!slide.backgroundImage) return;

    try {
        const bgData = await prepareImageData(slide.backgroundImage);
        if (!bgData) return;

        const bgMeta = await loadImageMeta(bgData);
        const bgFit = calculateCoverFit(SLIDE_WIDTH_INCHES, SLIDE_HEIGHT_INCHES, bgMeta.aspectRatio);

        pptSlide.addImage({
            data: bgData,
            x: round(bgFit.x),
            y: round(bgFit.y),
            w: round(bgFit.w),
            h: round(bgFit.h)
        });
    } catch (err) {
        console.warn('Error loading background image:', err);
    }
}

async function addImageElement(pptSlide, element, containerPos) {
    const imageData = await prepareImageData(element.content, element.filter);
    if (!imageData) return;

    const meta = await loadImageMeta(imageData);
    const aspectRatio = meta.aspectRatio || element.aspectRatio;
    const fit = calculateContainFit(containerPos.w, containerPos.h, aspectRatio);

    pptSlide.addImage({
        data: imageData,
        x: round(containerPos.x + fit.x),
        y: round(containerPos.y + fit.y),
        w: round(fit.w),
        h: round(fit.h)
    });
}

async function addVideoElement(pptSlide, element, containerPos) {
    const mediaSource = typeof element.content === 'string' ? element.content : '';
    const thumbData = await prepareImageData(element.thumbnail || element.content, element.filter);
    if (!thumbData) return;

    const meta = await loadImageMeta(thumbData);
    const aspectRatio = meta.aspectRatio || element.aspectRatio;
    const fit = calculateContainFit(containerPos.w, containerPos.h, aspectRatio);
    const finalPos = {
        x: containerPos.x + fit.x,
        y: containerPos.y + fit.y,
        w: fit.w,
        h: fit.h
    };

    const mediaOptions = {
        type: 'video',
        x: round(finalPos.x),
        y: round(finalPos.y),
        w: round(finalPos.w),
        h: round(finalPos.h),
        cover: thumbData
    };

    const extn = fileExtFromMimeType(element.mimeType);
    if (extn) {
        mediaOptions.extn = extn;
    }

    try {
        if (mediaSource.includes('base64,')) {
            mediaOptions.data = mediaSource.startsWith('data:') ? mediaSource.slice(5) : mediaSource;
            pptSlide.addMedia(mediaOptions);
            return;
        }

        if (mediaSource.startsWith('blob:') || mediaSource.startsWith('http') || mediaSource.startsWith('/')) {
            mediaOptions.path = mediaSource;
            pptSlide.addMedia(mediaOptions);
            return;
        }
    } catch (err) {
        console.warn('Error embedding video, falling back to thumbnail:', err);
    }

    // Fallback: poster image only (without fake play icon).
    pptSlide.addImage({
        data: thumbData,
        x: round(finalPos.x),
        y: round(finalPos.y),
        w: round(finalPos.w),
        h: round(finalPos.h)
    });
}

function addTextElement(pptSlide, element, containerPos) {
    const fontSizePx = Number(element.fontSize) || 16;
    const fontSizePoints = round(Math.max(8, fontSizePx * PX_TO_POINTS), 2);

    pptSlide.addText(element.content || '', {
        x: containerPos.x,
        y: containerPos.y,
        w: containerPos.w,
        h: containerPos.h,
        margin: 0,
        fontSize: fontSizePoints,
        fontFace: element.fontFamily || 'Arial',
        color: normalizeHexColor(element.color, '000000'),
        bold: Boolean(element.bold),
        italic: Boolean(element.italic),
        align: element.align || 'left',
        valign: 'top',
        breakLine: true
    });
}

async function addWatermarks(pptSlide) {
    try {
        const canonLogo = await prepareImageData('/assets/logo-rojo.png');
        if (canonLogo) {
            const canonMeta = await loadImageMeta(canonLogo);
            const canonH = 0.16;
            const canonW = Math.max(0.3, canonH * (canonMeta.aspectRatio || 3.8));
            pptSlide.addImage({
                data: canonLogo,
                x: 0.24,
                y: 0.16,
                w: round(canonW),
                h: round(canonH),
                transparency: 40
            });
        }

        const atlasLogo = await prepareImageData('/assets/logoatlas.png');
        if (atlasLogo) {
            const atlasMeta = await loadImageMeta(atlasLogo);
            const logoH = 0.22;
            const logoW = Math.max(0.24, logoH * (atlasMeta.aspectRatio || 2.2));
            pptSlide.addImage({
                data: atlasLogo,
                x: SLIDE_WIDTH_INCHES - logoW - 0.24,
                y: SLIDE_HEIGHT_INCHES - logoH - 0.16,
                w: round(logoW),
                h: round(logoH),
                transparency: 60
            });
        }
    } catch (err) {
        console.warn('Error adding watermark logos:', err);
    }
}

/**
 * Generate a PowerPoint presentation from slide data.
 * @param {Array} slides
 * @param {Object} options
 * @returns {Promise<void>}
 */
export async function generatePptx(slides, options = {}) {
    const {
        fileName = 'presentacion.pptx',
        title = 'Graficas Mensuales',
        author = 'Javo Apps'
    } = options;

    const pres = new pptxgenjs();
    pres.layout = 'LAYOUT_WIDE';
    pres.title = title;
    pres.author = author;
    pres.subject = 'Reporte mensual';
    pres.company = 'Atlas Digital - Canon';

    for (const slide of slides) {
        const pptSlide = pres.addSlide();
        await addBackground(slide, pptSlide);

        const elements = Array.isArray(slide.elements) ? slide.elements : [];
        const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        for (const element of sortedElements) {
            if (!element) continue;

            const containerPos = percentToInches(element.x, element.y, element.width, element.height);
            if (containerPos.w <= 0 || containerPos.h <= 0) continue;

            try {
                if (element.type === 'image') {
                    await addImageElement(pptSlide, element, containerPos);
                } else if (element.type === 'video') {
                    await addVideoElement(pptSlide, element, containerPos);
                } else if (element.type === 'text') {
                    addTextElement(pptSlide, element, containerPos);
                } else {
                    console.warn('Unknown element type:', element.type);
                }
            } catch (err) {
                console.warn('Error adding element:', element?.id || element?.type, err);
            }
        }

        if (!slide?.isCover) {
            await addWatermarks(pptSlide);
        }
    }

    await pres.writeFile({ fileName });
}

/**
 * Extract thumbnail from video file.
 * @param {File} videoFile
 * @returns {Promise<string>}
 */
export function extractVideoThumbnail(videoFile) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let sourceUrl = null;
        const frameCandidates = [];

        const analyzeFrame = (width, height) => {
            try {
                const sampleW = Math.min(width, 80);
                const sampleH = Math.min(height, 45);
                const sampleCanvas = document.createElement('canvas');
                sampleCanvas.width = sampleW;
                sampleCanvas.height = sampleH;
                const sampleCtx = sampleCanvas.getContext('2d');
                if (!sampleCtx) return { bad: false };

                sampleCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
                const pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
                let total = 0;
                let sumR = 0;
                let sumG = 0;
                let sumB = 0;
                let magentaLike = 0;

                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    sumR += r;
                    sumG += g;
                    sumB += b;
                    total += 1;
                    if (r > 170 && b > 170 && g < 130) {
                        magentaLike += 1;
                    }
                }

                if (total === 0) return { bad: false };
                const avgR = sumR / total;
                const avgG = sumG / total;
                const avgB = sumB / total;
                const magentaRatio = magentaLike / total;
                const overlyMagenta = magentaRatio > 0.45 || (avgR > 180 && avgB > 180 && avgG < 120);

                return { bad: overlyMagenta };
            } catch {
                return { bad: false };
            }
        };

        const seekTo = (time) => new Promise((resolveSeek) => {
            const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                resolveSeek();
            };
            video.addEventListener('seeked', onSeeked, { once: true });
            video.currentTime = time;
        });

        const cleanup = () => {
            if (sourceUrl) {
                URL.revokeObjectURL(sourceUrl);
                sourceUrl = null;
            }
        };

        video.onloadedmetadata = async () => {
            const safeDuration = Number.isFinite(video.duration) ? video.duration : 0;
            const safeMax = safeDuration > 0.2 ? safeDuration - 0.05 : 0;
            const checkpoints = safeDuration > 0
                ? [0.08, 0.16, 0.28, 0.42, 0.62, 0.82].map(p => Math.min(safeMax, Math.max(0, safeDuration * p)))
                : [0];

            canvas.width = video.videoWidth || 1920;
            canvas.height = video.videoHeight || 1080;

            try {
                for (const point of checkpoints) {
                    await seekTo(point);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const quality = analyzeFrame(canvas.width, canvas.height);
                    frameCandidates.push({
                        bad: quality.bad,
                        dataUrl: canvas.toDataURL('image/png')
                    });
                    if (!quality.bad) {
                        break;
                    }
                }

                const selected = frameCandidates.find(f => !f.bad) || frameCandidates[0];
                cleanup();
                resolve(selected?.dataUrl || canvas.toDataURL('image/png'));
            } catch (err) {
                cleanup();
                reject(err instanceof Error ? err : new Error('Error generating video thumbnail'));
            }
        };

        video.onerror = () => {
            cleanup();
            reject(new Error('Error loading video'));
        };

        sourceUrl = URL.createObjectURL(videoFile);
        video.src = sourceUrl;
        video.load();
    });
}

/**
 * Render first page of a PDF as an image.
 * @param {File} pdfFile
 * @returns {Promise<{dataUrl: string, width: number, height: number}>}
 */
export async function renderPdfFirstPage(pdfFile) {
    const pdfjs = await import('pdfjs-dist');
    const bytes = await pdfFile.arrayBuffer();

    const pdfDoc = await pdfjs.getDocument({
        data: bytes,
        disableWorker: true,
        stopAtErrors: false
    }).promise;

    const firstPage = await pdfDoc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo inicializar el canvas para PDF');

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    await firstPage.render({
        canvasContext: ctx,
        viewport
    }).promise;

    return {
        dataUrl: canvas.toDataURL('image/jpeg', 0.92),
        width: canvas.width,
        height: canvas.height
    };
}

/**
 * Read file as data URL.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default generatePptx;
