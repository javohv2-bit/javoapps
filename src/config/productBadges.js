/**
 * Sistema de Badges para Productos
 * Permite marcar productos con estados especiales y origen
 */

// Definición de badges disponibles
export const BADGE_TYPES = {
    PENDING_SEND: 'pending_send',      // Listo pero pendiente de enviar al cliente
    NOT_REQUESTED: 'not_requested',    // Creado por iniciativa propia, no solicitado
    SENT: 'sent',                      // Ya enviado al cliente
    APPROVED: 'approved',              // Aprobado por el cliente
    HITES_ORIGIN: 'hites_origin',      // InPage originado/creado para Hites
};

// Configuración visual de cada badge (sin emojis, usar iconos Lucide)
export const BADGE_CONFIG = {
    [BADGE_TYPES.PENDING_SEND]: {
        label: 'Pendiente de enviar',
        shortLabel: 'Pendiente',
        color: 'amber',
        bgClass: 'bg-amber-100',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-200',
        iconName: 'Send',       // Lucide icon name
        dotColor: 'bg-amber-500',
    },
    [BADGE_TYPES.NOT_REQUESTED]: {
        label: 'Creado no solicitado',
        shortLabel: 'No solicitado',
        color: 'blue',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
        iconName: 'Lightbulb',
        dotColor: 'bg-blue-500',
    },
    [BADGE_TYPES.SENT]: {
        label: 'Enviado',
        shortLabel: 'Enviado',
        color: 'emerald',
        bgClass: 'bg-emerald-100',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
        iconName: 'CheckCircle',
        dotColor: 'bg-emerald-500',
    },
    [BADGE_TYPES.APPROVED]: {
        label: 'Aprobado',
        shortLabel: 'Aprobado',
        color: 'purple',
        bgClass: 'bg-purple-100',
        textClass: 'text-purple-700',
        borderClass: 'border-purple-200',
        iconName: 'Star',
        dotColor: 'bg-purple-500',
    },
    [BADGE_TYPES.HITES_ORIGIN]: {
        label: 'Origen Hites',
        shortLabel: 'Hites',
        color: 'rose',
        bgClass: 'bg-rose-100',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-200',
        iconName: 'Store',
        dotColor: 'bg-rose-500',
    },
};

// Badges iniciales para productos existentes
export const INITIAL_PRODUCT_BADGES = {
    // Pendientes de enviar - productos listos
    'eos-r50v': BADGE_TYPES.PENDING_SEND,
    'powershot-v1': BADGE_TYPES.PENDING_SEND,
    'pixma-g4180': BADGE_TYPES.PENDING_SEND,
    'kit-gi10': BADGE_TYPES.PENDING_SEND,
    'kit-gi11': BADGE_TYPES.PENDING_SEND,
    'kit-gi190': BADGE_TYPES.PENDING_SEND,
    
    // Creados sin solicitud
    'g3190': BADGE_TYPES.NOT_REQUESTED,
    'g7010': BADGE_TYPES.NOT_REQUESTED,
};

// Obtener la configuración de un badge
export const getBadgeConfig = (badgeType) => {
    return BADGE_CONFIG[badgeType] || null;
};

// Obtener el badge de un producto por su ID
export const getProductBadge = (productId, productBadges = []) => {
    // Primero verificar si tiene badges en los datos del producto (desde Supabase)
    if (productBadges && productBadges.length > 0) {
        return productBadges[0]; // Retornar el primer badge
    }
    
    // Luego verificar si el ID indica que es de Hites
    if (productId && productId.endsWith('-hites')) {
        return BADGE_TYPES.HITES_ORIGIN;
    }
    
    // Finalmente verificar badges estáticos
    return INITIAL_PRODUCT_BADGES[productId] || null;
};

export default {
    BADGE_TYPES,
    BADGE_CONFIG,
    INITIAL_PRODUCT_BADGES,
    getBadgeConfig,
    getProductBadge,
};
