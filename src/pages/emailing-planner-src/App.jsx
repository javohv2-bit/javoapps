import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from './supabase'
import './index.css'

// ========================================
// UTILITIES
// ========================================

// Generate UUID for Supabase compatibility
const generateId = () => crypto.randomUUID()

// ========================================
// CONTEXT & STATE MANAGEMENT
// ========================================

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

// ========================================
// ICONS
// ========================================

const Icons = {
    calendar: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    grid: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    chart: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    plus: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    x: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    chevronLeft: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    ),
    chevronRight: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    ),
    image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    edit: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    trash: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
    check: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    menu: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    ),
    note: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    alert: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    )
}

// ========================================
// CATEGORIES CONFIG
// ========================================

const CATEGORIAS = {
    OFERTAS: { nombre: 'Ofertas', color: '#cc0000', bgColor: 'rgba(204, 0, 0, 0.1)' },
    PRODUCTO: { nombre: 'Producto', color: '#2c8a38', bgColor: 'rgba(44, 138, 56, 0.1)' },
    BRANDING: { nombre: 'Branding', color: '#f09516', bgColor: 'rgba(240, 149, 22, 0.1)' },
    EMPRESAS: { nombre: 'Empresas', color: '#0076ce', bgColor: 'rgba(0, 118, 206, 0.1)' }
}



// ========================================
// TOAST CONTAINER
// ========================================

function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' && Icons.check}
                        {toast.type === 'error' && Icons.alert}
                        {toast.type === 'info' && Icons.info}
                    </div>
                    <div className="toast-content">
                        <div className="toast-title">{toast.title}</div>
                        <div className="toast-message">{toast.message}</div>
                    </div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        {Icons.x}
                    </button>
                </div>
            ))}
        </div>
    )
}

// ========================================
// SIDEBAR COMPONENT
// ========================================

// ========================================
// FLOATING PREVIEW COMPONENT
// ========================================

function FloatingPreview({ image, position }) {
    if (!image) return null

    return (
        <div className="floating-preview" style={{
            position: 'fixed',
            left: position.x + 20,
            top: position.y - 100,
            width: 200,
            zIndex: 3000,
            pointerEvents: 'none',
            background: 'white',
            padding: '8px',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid rgba(0,0,0,0.05)',
        }}>
            <img
                src={image.url}
                alt="Preview"
                style={{
                    width: '100%',
                    borderRadius: '8px',
                    objectFit: 'cover'
                }}
            />
            {image.title && (
                <div style={{
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1d1d1f',
                    textAlign: 'center'
                }}>
                    {image.title}
                </div>
            )}
        </div>
    )
}

// ========================================
// SIDEBAR COMPONENT
// ========================================

function Sidebar({ activeView, setActiveView, sidebarOpen, setSidebarOpen }) {
    const { tematicas, envios, currentMonth, currentYear } = useApp()

    const enviosMes = envios.filter(e => {
        const [year, month] = e.fecha.split('-').map(Number)
        return (month - 1) === currentMonth && year === currentYear
    })

    return (
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <nav style={{ flex: 1 }}>
                <div
                    className={`nav-item ${activeView === 'tematicas' ? 'active' : ''}`}
                    onClick={() => { setActiveView('tematicas'); setSidebarOpen(false) }}
                >
                    {Icons.grid}
                    <span>Temáticas</span>
                </div>
                <div
                    className={`nav-item ${activeView === 'calendario' ? 'active' : ''}`}
                    onClick={() => { setActiveView('calendario'); setSidebarOpen(false) }}
                >
                    {Icons.calendar}
                    <span>Calendario</span>
                </div>
                <div
                    className={`nav-item ${activeView === 'resumen' ? 'active' : ''}`}
                    onClick={() => { setActiveView('resumen'); setSidebarOpen(false) }}
                >
                    {Icons.chart}
                    <span>Resumen</span>
                </div>
            </nav>

            <div className="stat-card" style={{ marginTop: 'auto' }}>
                <div className="stat-value">{enviosMes.length}</div>
                <div className="stat-label">Envíos este mes</div>
            </div>
        </aside>
    )
}

// ========================================
// MOBILE NAVIGATION
// ========================================

function MobileNav({ activeView, setActiveView }) {
    return (
        <nav className="mobile-nav">
            <div
                className={`nav-item ${activeView === 'tematicas' ? 'active' : ''}`}
                onClick={() => setActiveView('tematicas')}
                style={{ flex: 1, justifyContent: 'center' }}
            >
                {Icons.grid}
            </div>
            <div
                className={`nav-item ${activeView === 'calendario' ? 'active' : ''}`}
                onClick={() => setActiveView('calendario')}
                style={{ flex: 1, justifyContent: 'center' }}
            >
                {Icons.calendar}
            </div>
            <div
                className={`nav-item ${activeView === 'resumen' ? 'active' : ''}`}
                onClick={() => setActiveView('resumen')}
                style={{ flex: 1, justifyContent: 'center' }}
            >
                {Icons.chart}
            </div>
        </nav>
    )
}

// ========================================
// TEMATICA FORM MODAL
// ========================================

function TematicaFormModal({ tematica, onClose, onSave }) {
    const { addToast } = useApp()
    const [nombre, setNombre] = useState(tematica?.nombre || '')
    const [categoria, setCategoria] = useState(tematica?.categoria || 'OFERTAS')
    const [grafica, setGrafica] = useState(tematica?.graficaActual || '')

    const [uploading, setUploading] = useState(false)

    const uploadImage = async (file) => {
        try {
            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('graficas')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('graficas')
                .getPublicUrl(filePath)

            return data.publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            addToast('Error al subir la imagen', 'error')
            return null
        } finally {
            setUploading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = await uploadImage(file)
            if (url) setGrafica(url)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!nombre.trim()) return

        onSave({
            id: tematica?.id || generateId(),
            nombre: nombre.trim(),
            categoria,
            graficaActual: grafica,
            historialGraficas: tematica?.historialGraficas || [],
            createdAt: tematica?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{tematica ? 'Editar Temática' : 'Nueva Temática'}</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        {Icons.x}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="mb-md">
                            <label className="label">Nombre de la temática</label>
                            <input
                                type="text"
                                className="input"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                placeholder="Ej: Black Friday 2024"
                                autoFocus
                            />
                        </div>

                        <div className="mb-md">
                            <label className="label">Categoría</label>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                {Object.entries(CATEGORIAS).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className="btn"
                                        style={{
                                            background: categoria === key ? cat.bgColor : 'white',
                                            color: categoria === key ? cat.color : 'var(--text-secondary)',
                                            border: categoria === key ? `2px solid ${cat.color}` : '2px solid var(--border-subtle)'
                                        }}
                                        onClick={() => setCategoria(key)}
                                    >
                                        {cat.nombre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="label">Gráfica del mailing</label>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {grafica ? (
                                    <img src={grafica} alt="Preview" />
                                ) : (
                                    <>
                                        {Icons.image}
                                        <span className="image-upload-text" style={{ marginTop: 'var(--space-sm)' }}>
                                            Click para subir imagen
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            {uploading ? 'Subiendo...' : (tematica ? 'Guardar cambios' : 'Crear temática')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ========================================
// TEMATICA CARD
// ========================================

function TematicaCard({ tematica, onEdit, onDelete, ultimoEnvio, onImageClick }) {
    const cat = CATEGORIAS[tematica.categoria]

    // Formatear fecha de último envío
    let fechaTexto = 'Sin envíos'
    if (ultimoEnvio) {
        const [year, month, day] = ultimoEnvio.fecha.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        fechaTexto = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    }

    return (
        <div className="card-vertical" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {/* Image - Tall for email graphics */}
            <div
                className="card-image-wrapper"
                onClick={() => tematica.graficaActual && onImageClick && onImageClick(tematica.graficaActual, tematica.nombre)}
                style={{
                    cursor: tematica.graficaActual ? 'zoom-in' : 'default',
                    aspectRatio: '3/4',
                    position: 'relative'
                }}
            >
                {tematica.graficaActual ? (
                    <img
                        src={tematica.graficaActual}
                        alt={tematica.nombre}
                        className="card-image"
                        style={{ objectPosition: 'top' }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                )}
                {/* Category badge */}
                <span
                    className="badge"
                    style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(255,255,255,0.95)',
                        color: cat.color,
                        fontSize: '0.6rem',
                        padding: '3px 8px',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    {cat.nombre}
                </span>
            </div>

            {/* Content */}
            <div className="card-content" style={{ padding: '12px', gap: '8px' }}>
                <h4 className="card-title" style={{ fontSize: '0.875rem', marginBottom: '4px' }}>{tematica.nombre}</h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Last sent date - small icon */}
                    <div className="card-last-sent" style={{
                        fontSize: '0.6875rem',
                        gap: '4px',
                        border: 'none',
                        padding: 0,
                        margin: 0
                    }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{fechaTexto}</span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            className="btn btn-ghost btn-icon"
                            style={{ width: '26px', height: '26px', padding: 0, minWidth: 'unset' }}
                            onClick={(e) => { e.stopPropagation(); onEdit(tematica) }}
                            title="Editar"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                        <button
                            className="btn btn-ghost btn-icon"
                            style={{ width: '26px', height: '26px', padding: 0, minWidth: 'unset', color: 'var(--cat-ofertas)' }}
                            onClick={(e) => { e.stopPropagation(); onDelete(tematica) }}
                            title="Eliminar"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ========================================
// IMAGE PREVIEW MODAL
// ========================================

function ImagePreviewModal({ imageUrl, altText, onClose }) {
    if (!imageUrl) return null

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000, background: 'rgba(0,0,0,0.85)' }}>
            <div style={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh', display: 'flex', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                <button
                    className="btn btn-secondary btn-icon"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        right: 0,
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        zIndex: 20
                    }}
                >
                    {Icons.x}
                </button>
                <img
                    src={imageUrl}
                    alt={altText}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                />
            </div>
        </div>
    )
}

// ========================================
// TEMATICAS VIEW
// ========================================

function TematicasView() {
    const { tematicas, setTematicas, envios, addToast } = useApp()
    const [showModal, setShowModal] = useState(false)
    const [editingTematica, setEditingTematica] = useState(null)
    const [filtroCategoria, setFiltroCategoria] = useState('TODAS')
    const [busqueda, setBusqueda] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(null) // tematica to delete
    const [previewImage, setPreviewImage] = useState(null) // { url, alt }

    const handleSave = (tematica) => {
        setTematicas(prev => {
            const exists = prev.find(t => t.id === tematica.id)
            if (exists) {
                return prev.map(t => t.id === tematica.id ? tematica : t)
            }
            return [...prev, tematica]
        })
        const exists = tematicas.find(t => t.id === tematica.id)
        addToast(exists ? 'Temática actualizada correctamente' : 'Temática creada correctamente', 'success')
        setEditingTematica(null)
    }

    const handleEdit = (tematica) => {
        setEditingTematica(tematica)
        setShowModal(true)
    }

    const handleDeleteClick = (tematica) => {
        setDeleteConfirm(tematica)
    }

    const confirmDelete = () => {
        if (deleteConfirm) {
            setTematicas(prev => prev.filter(t => t.id !== deleteConfirm.id))
            addToast('Temática eliminada correctamente', 'info')
            setDeleteConfirm(null)
        }
    }

    const filteredTematicas = tematicas.filter(t => {
        const matchCategoria = filtroCategoria === 'TODAS' || t.categoria === filtroCategoria
        const matchBusqueda = t.nombre.toLowerCase().includes(busqueda.toLowerCase())
        return matchCategoria && matchBusqueda
    })

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Temáticas</h1>
                    <p className="page-subtitle">Gestiona las temáticas y gráficas de tus mailings</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditingTematica(null); setShowModal(true) }}>
                    {Icons.plus}
                    <span>Nueva temática</span>
                </button>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Buscar temáticas..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ maxWidth: 300 }}
                />
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    <button
                        className={`btn ${filtroCategoria === 'TODAS' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFiltroCategoria('TODAS')}
                    >
                        Todas
                    </button>
                    {Object.entries(CATEGORIAS).map(([key, cat]) => (
                        <button
                            key={key}
                            className="btn"
                            style={{
                                background: filtroCategoria === key ? cat.bgColor : 'var(--bg-glass)',
                                color: filtroCategoria === key ? cat.color : 'var(--text-secondary)',
                                border: filtroCategoria === key ? `1px solid ${cat.color}` : '1px solid var(--border-subtle)'
                            }}
                            onClick={() => setFiltroCategoria(key)}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {filteredTematicas.length === 0 ? (
                <div className="empty-state">
                    {Icons.grid}
                    <p>No hay temáticas{filtroCategoria !== 'TODAS' ? ` en ${CATEGORIAS[filtroCategoria].nombre}` : ''}</p>
                    <button className="btn btn-primary mt-md" onClick={() => setShowModal(true)}>
                        Crear primera temática
                    </button>
                </div>
            ) : (
                <div className="grid-tematicas">
                    {filteredTematicas.map(tematica => {
                        const ultimoEnvio = envios
                            .filter(e => e.tematicaId === tematica.id)
                            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0] // Ordenar desc por fecha

                        return (
                            <TematicaCard
                                key={tematica.id}
                                tematica={tematica}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                ultimoEnvio={ultimoEnvio}
                                onImageClick={(url, alt) => setPreviewImage({ url, alt })}
                            />
                        )
                    })}
                </div>
            )}

            {showModal && (
                <TematicaFormModal
                    tematica={editingTematica}
                    onClose={() => { setShowModal(false); setEditingTematica(null) }}
                    onSave={handleSave}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-header">
                            <h3>Eliminar temática</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setDeleteConfirm(null)}>
                                {Icons.x}
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: 'var(--text-secondary)' }}>
                                ¿Estás seguro de eliminar la temática <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirm.nombre}</strong>?
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'var(--space-sm)' }}>
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                                Cancelar
                            </button>
                            <button
                                className="btn"
                                style={{ background: 'var(--cat-ofertas)', color: 'white' }}
                                onClick={confirmDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Previsualización de Imagen */}
            {previewImage && (
                <ImagePreviewModal
                    imageUrl={previewImage.url}
                    altText={previewImage.alt}
                    onClose={() => setPreviewImage(null)}
                />
            )}


        </div>
    )
}

// ========================================
// AGENDA MODAL (Add to Calendar from Day Click)
// ========================================

const BASES_DATOS = [
    { id: 'ecommerce', nombre: 'E-Commerce' },
    { id: 'se_canon', nombre: 'SE Canon' },
    { id: 'zoomin', nombre: 'Zoomin' },
    { id: 'webinar', nombre: 'Inscritos Webinar' },
    { id: 'full_frame', nombre: 'Base Full Frame' },
    { id: 'empresas_plotter', nombre: 'Empresas Plotter' },
    { id: 'empresas_laser', nombre: 'Empresas Laser' }
]

function AgendaModal({ selectedDate, onClose }) {
    const { tematicas, setEnvios, addToast } = useApp()
    const [modo, setModo] = useState('tematica') // 'tematica' | 'nuevo'
    const [selectedTematica, setSelectedTematica] = useState(null)
    const [filtroCategoria, setFiltroCategoria] = useState('TODAS')

    // Campos para contenido nuevo
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [basesSeleccionadas, setBasesSeleccionadas] = useState([])
    const [usaDataExtension, setUsaDataExtension] = useState(false)
    const [nombreDataExtension, setNombreDataExtension] = useState('')

    // Común
    const [observaciones, setObservaciones] = useState('')

    const filteredTematicas = tematicas.filter(t =>
        filtroCategoria === 'TODAS' || t.categoria === filtroCategoria
    )

    const toggleBase = (baseId) => {
        setBasesSeleccionadas(prev =>
            prev.includes(baseId)
                ? prev.filter(b => b !== baseId)
                : [...prev, baseId]
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let nuevoEnvio

        if (modo === 'tematica') {
            if (!selectedTematica) return
            nuevoEnvio = {
                id: generateId(),
                tipo: 'tematica',
                tematicaId: selectedTematica.id,
                tematicaNombre: selectedTematica.nombre,
                tematicaCategoria: selectedTematica.categoria,
                graficaUsada: selectedTematica.graficaActual,
                fecha: selectedDate,
                observaciones,
                estado: 'planificado',
                createdAt: new Date().toISOString()
            }
        } else {
            if (!titulo.trim()) return
            nuevoEnvio = {
                id: generateId(),
                tipo: 'nuevo',
                tematicaNombre: titulo,
                tematicaCategoria: 'PRODUCTO', // default para nuevos
                descripcion,
                basesSeleccionadas,
                usaDataExtension,
                nombreDataExtension: usaDataExtension ? nombreDataExtension : null,
                fecha: selectedDate,
                observaciones,
                estado: 'planificado',
                createdAt: new Date().toISOString()
            }
        }

        setEnvios(prev => [...prev, nuevoEnvio])
        addToast('Envío agendado correctamente', 'success', 'Envío creado')
        onClose()
    }

    // Format date for display
    const [year, month, day] = selectedDate.split('-').map(Number)
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const displayDate = `${day} de ${meses[month - 1]} ${year}`

    const canSubmit = modo === 'tematica' ? selectedTematica : titulo.trim()

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
                <div className="modal-header">
                    <h3>Agendar envío - {displayDate}</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        {Icons.x}
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Selector de modo */}
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                            <button
                                type="button"
                                className={`btn ${modo === 'tematica' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setModo('tematica')}
                                style={{ flex: 1 }}
                            >
                                Usar Temática
                            </button>
                            <button
                                type="button"
                                className={`btn ${modo === 'nuevo' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setModo('nuevo')}
                                style={{ flex: 1 }}
                            >
                                Contenido Nuevo
                            </button>
                        </div>

                        {modo === 'tematica' ? (
                            /* Modo Temática */
                            <div className="mb-md">
                                <label className="label">Selecciona una temática</label>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        className={`btn ${filtroCategoria === 'TODAS' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setFiltroCategoria('TODAS')}
                                        style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                                    >
                                        Todas
                                    </button>
                                    {Object.entries(CATEGORIAS).map(([key, cat]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            className="btn"
                                            style={{
                                                padding: '4px 12px',
                                                fontSize: '0.75rem',
                                                background: filtroCategoria === key ? cat.bgColor : 'var(--bg-glass)',
                                                color: filtroCategoria === key ? cat.color : 'var(--text-secondary)',
                                                border: filtroCategoria === key ? `1px solid ${cat.color}` : '1px solid var(--border-subtle)'
                                            }}
                                            onClick={() => setFiltroCategoria(key)}
                                        >
                                            {cat.nombre}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                                    {filteredTematicas.map(tematica => {
                                        const cat = CATEGORIAS[tematica.categoria]
                                        const isSelected = selectedTematica?.id === tematica.id
                                        return (
                                            <div
                                                key={tematica.id}
                                                onClick={() => setSelectedTematica(tematica)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-sm)',
                                                    padding: '8px',
                                                    background: isSelected ? 'var(--bg-secondary)' : 'white',
                                                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-md)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ flex: 1, fontWeight: 500, color: isSelected ? 'white' : 'var(--text-primary)', fontSize: '0.875rem' }}>
                                                    {tematica.nombre}
                                                </div>
                                                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 'var(--radius-full)', background: isSelected ? 'rgba(255,255,255,0.2)' : cat.bgColor, color: isSelected ? 'white' : cat.color }}>
                                                    {cat.nombre}
                                                </span>
                                                {isSelected && <span style={{ color: 'white' }}>{Icons.check}</span>}
                                            </div>
                                        )
                                    })}
                                    {filteredTematicas.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-muted)' }}>
                                            No hay temáticas
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Modo Contenido Nuevo */
                            <>
                                <div className="mb-md">
                                    <label className="label">Título del envío *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={titulo}
                                        onChange={e => setTitulo(e.target.value)}
                                        placeholder="Ej: Promoción Navidad, Lanzamiento nuevo producto..."
                                    />
                                </div>

                                <div className="mb-md">
                                    <label className="label">Descripción</label>
                                    <textarea
                                        className="input"
                                        value={descripcion}
                                        onChange={e => setDescripcion(e.target.value)}
                                        placeholder="Descripción del contenido..."
                                        style={{ minHeight: 60 }}
                                    />
                                </div>

                                <div className="mb-md">
                                    <label className="label">Bases de datos a enviar</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                                        {BASES_DATOS.map(base => {
                                            const isSelected = basesSeleccionadas.includes(base.id)
                                            return (
                                                <button
                                                    key={base.id}
                                                    type="button"
                                                    onClick={() => toggleBase(base.id)}
                                                    style={{
                                                        padding: '4px 10px',
                                                        fontSize: '0.75rem',
                                                        borderRadius: 'var(--radius-full)',
                                                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                                                        background: isSelected ? 'var(--accent-gradient)' : 'var(--bg-glass)',
                                                        color: isSelected ? 'white' : 'var(--text-secondary)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {isSelected && '✓ '}{base.nombre}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="mb-md" style={{
                                    padding: 'var(--space-md)',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: usaDataExtension ? '1px solid var(--cat-branding)' : '1px solid var(--border-subtle)'
                                }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={usaDataExtension}
                                            onChange={e => setUsaDataExtension(e.target.checked)}
                                            style={{ width: 18, height: 18, accentColor: 'var(--cat-branding)' }}
                                        />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                            El cliente enviará una base específica (Data Extension)
                                        </span>
                                    </label>
                                    {usaDataExtension && (
                                        <input
                                            type="text"
                                            className="input"
                                            value={nombreDataExtension}
                                            onChange={e => setNombreDataExtension(e.target.value)}
                                            placeholder="Nombre de la Data Extension (opcional)"
                                            style={{ marginTop: 'var(--space-sm)' }}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        <div>
                            <label className="label">Observaciones</label>
                            <textarea
                                className="input"
                                value={observaciones}
                                onChange={e => setObservaciones(e.target.value)}
                                placeholder="Notas adicionales..."
                                style={{ minHeight: 60 }}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!canSubmit}
                            style={{ opacity: canSubmit ? 1 : 0.5 }}
                        >
                            Agendar envío
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ========================================
// ENVIO DETAIL MODAL
// ========================================

function EnvioDetailModal({ envio, onClose, onUpdate, onDelete }) {
    const { tematicas, addToast } = useApp()
    const [observaciones, setObservaciones] = useState(envio.observaciones || '')
    const [grafica, setGrafica] = useState(envio.graficaUsada || '')
    const [enviado, setEnviado] = useState(envio.enviado || false)

    const tematica = tematicas.find(t => t.id === envio.tematicaId)
    const cat = CATEGORIAS[envio.tematicaCategoria]

    const [uploading, setUploading] = useState(false)

    const uploadImage = async (file) => {
        try {
            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('graficas')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('graficas')
                .getPublicUrl(filePath)

            return data.publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            addToast('Error al subir la imagen', 'error')
            return null
        } finally {
            setUploading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = await uploadImage(file)
            if (url) setGrafica(url)
        }
    }

    const handleSave = () => {
        onUpdate({
            ...envio,
            observaciones,
            graficaUsada: grafica,
            enviado,
            updatedAt: new Date().toISOString()
        })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                <div className="modal-header">
                    <h3>Detalle del envío</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        {Icons.x}
                    </button>
                </div>
                <div className="modal-body">
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <span className="badge" style={{ background: cat.bgColor, color: cat.color }}>
                            {cat.nombre}
                        </span>
                        <h2 style={{ marginTop: 'var(--space-sm)' }}>{envio.tematicaNombre}</h2>
                        <p className="text-muted">
                            Programado para: {new Date(envio.fecha).toLocaleDateString('es-CL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="mb-lg">
                        <label className="label">Gráfica del envío</label>
                        <div className="image-upload" style={{ aspectRatio: '16/9' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {grafica ? (
                                <img src={grafica} alt="Gráfica" />
                            ) : (
                                <>
                                    {Icons.image}
                                    <span className="image-upload-text" style={{ marginTop: 'var(--space-sm)' }}>
                                        Click para subir/actualizar gráfica
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-lg">
                        <label className="label">Estado del envío</label>
                        <div
                            onClick={() => setEnviado(!enviado)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-md)',
                                padding: 'var(--space-md)',
                                background: enviado ? 'var(--cat-producto-bg)' : 'var(--cat-branding-bg)',
                                border: `2px solid ${enviado ? 'var(--cat-producto)' : 'var(--cat-branding)'}`,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: enviado ? 'var(--cat-producto)' : 'white',
                                border: `2px solid ${enviado ? 'var(--cat-producto)' : 'var(--cat-branding)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {enviado && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: enviado ? 'var(--cat-producto)' : 'var(--cat-branding)'
                                }}>
                                    {enviado ? '✓ Enviado' : '⏳ Pendiente'}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    {enviado ? 'El envío ya fue realizado' : 'Click para marcar como enviado'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="label">Observaciones</label>
                        <textarea
                            className="input"
                            value={observaciones}
                            onChange={e => setObservaciones(e.target.value)}
                            placeholder="Ej: Actualizar gráfica, cambiar productos destacados..."
                        />
                    </div>
                </div>
                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                    <button
                        className="btn btn-ghost"
                        style={{ color: 'var(--cat-ofertas)' }}
                        onClick={() => { onDelete(envio.id); onClose() }}
                    >
                        {Icons.trash}
                        <span>Eliminar</span>
                    </button>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={uploading}>
                            {uploading ? 'Subiendo...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ========================================
// CALENDARIO VIEW
// ========================================

function CalendarioView() {
    const {
        envios, setEnvios,
        currentMonth, setCurrentMonth,
        currentYear, setCurrentYear,
        tematicas,
        addToast
    } = useApp()
    const [selectedEnvio, setSelectedEnvio] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [hoveredImage, setHoveredImage] = useState(null) // { url, title, x, y }
    const [draggedEnvio, setDraggedEnvio] = useState(null)
    const [dragOverDay, setDragOverDay] = useState(null)

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    const primerDia = new Date(currentYear, currentMonth, 1)
    const ultimoDia = new Date(currentYear, currentMonth + 1, 0)
    const diasEnMes = ultimoDia.getDate()
    // Ajustar para que Lunes sea 0 y Domingo 6
    const primerDiaSemana = (primerDia.getDay() + 6) % 7

    const today = new Date()
    const isToday = (day) => {
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
    }

    const getEnviosForDay = (day) => {
        return envios.filter(e => {
            // Parse date string directly to avoid timezone issues
            const [year, month, dayNum] = e.fecha.split('-').map(Number)
            return dayNum === day &&
                (month - 1) === currentMonth &&
                year === currentYear
        })
    }

    const enviosMes = envios.filter(e => {
        const [year, month] = e.fecha.split('-').map(Number)
        return (month - 1) === currentMonth && year === currentYear
    })

    const navigateMonth = (direction) => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11)
                setCurrentYear(prev => prev - 1)
            } else {
                setCurrentMonth(prev => prev - 1)
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0)
                setCurrentYear(prev => prev + 1)
            } else {
                setCurrentMonth(prev => prev + 1)
            }
        }
    }

    const handleUpdateEnvio = (updatedEnvio) => {
        setEnvios(prev => prev.map(e => e.id === updatedEnvio.id ? updatedEnvio : e))
        addToast('Envío actualizado correctamente', 'success')
    }

    const handleDeleteEnvio = (envioId) => {
        setEnvios(prev => prev.filter(e => e.id !== envioId))
        addToast('Envío eliminado', 'info')
    }

    const handleDayClick = (day, otherMonth) => {
        if (otherMonth) return
        // Format date as YYYY-MM-DD
        const month = (currentMonth + 1).toString().padStart(2, '0')
        const dayStr = day.toString().padStart(2, '0')
        const dateStr = `${currentYear}-${month}-${dayStr}`
        setSelectedDate(dateStr)
    }

    // Función para obtener el estado del día (para colores del calendario)
    const getDayStatus = (day) => {
        const dayEnvios = getEnviosForDay(day)
        if (dayEnvios.length === 0) return null
        
        const allEnviados = dayEnvios.every(e => e.enviado)
        const someEnviados = dayEnvios.some(e => e.enviado)
        
        if (allEnviados) return 'enviado'
        if (someEnviados) return 'parcial'
        return 'pendiente'
    }

    // Drag and drop handlers
    const handleDragStart = (e, envio) => {
        setDraggedEnvio(envio)
        e.dataTransfer.effectAllowed = 'move'
        // Make the drag image transparent
        const img = new Image()
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        e.dataTransfer.setDragImage(img, 0, 0)
    }

    const handleDragEnd = () => {
        setDraggedEnvio(null)
        setDragOverDay(null)
    }

    const handleDragOver = (e, day, otherMonth) => {
        e.preventDefault()
        if (otherMonth || !draggedEnvio) return
        e.dataTransfer.dropEffect = 'move'
        setDragOverDay(day)
    }

    const handleDragLeave = () => {
        setDragOverDay(null)
    }

    const handleDrop = (e, day, otherMonth) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOverDay(null)
        
        if (otherMonth || !draggedEnvio) return
        
        // Format new date
        const month = (currentMonth + 1).toString().padStart(2, '0')
        const dayStr = day.toString().padStart(2, '0')
        const newDate = `${currentYear}-${month}-${dayStr}`
        
        // Don't update if same date
        if (draggedEnvio.fecha === newDate) {
            setDraggedEnvio(null)
            return
        }
        
        // Update envio with new date
        const updatedEnvio = { ...draggedEnvio, fecha: newDate }
        setEnvios(prev => prev.map(e => e.id === draggedEnvio.id ? updatedEnvio : e))
        addToast(`Envío movido a ${day} de ${meses[currentMonth]}`, 'success')
        setDraggedEnvio(null)
    }

    // Build calendar grid
    const calendarDays = []

    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthDays - i, otherMonth: true })
    }

    // Current month days
    for (let day = 1; day <= diasEnMes; day++) {
        calendarDays.push({ day, otherMonth: false })
    }

    // Next month days
    const remainingDays = 42 - calendarDays.length
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({ day: i, otherMonth: true })
    }

    // Stats by category
    const statsByCategory = Object.keys(CATEGORIAS).reduce((acc, cat) => {
        acc[cat] = enviosMes.filter(e => e.tematicaCategoria === cat).length
        return acc
    }, {})

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calendario</h1>
                    <p className="page-subtitle">Haz clic en un día para agendar un envío</p>
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: '4px 12px',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{enviosMes.length}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</span>
                </div>
                {Object.entries(CATEGORIAS).map(([key, cat]) => (
                    <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        padding: '4px 10px',
                        background: cat.bgColor,
                        borderRadius: 'var(--radius-full)'
                    }}>
                        <span style={{ fontWeight: 600, color: cat.color, fontSize: '0.875rem' }}>
                            {statsByCategory[key]}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: cat.color, opacity: 0.8 }}>{cat.nombre}</span>
                    </div>
                ))}
                
                {/* Leyenda de estados */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    padding: '4px 12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    marginLeft: 'auto'
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estado:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34c759' }} />
                        <span style={{ fontSize: '0.7rem', color: '#34c759' }}>Enviado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff9500' }} />
                        <span style={{ fontSize: '0.7rem', color: '#ff9500' }}>Pendiente</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button className="btn btn-secondary btn-icon" onClick={() => navigateMonth('prev')}>
                            {Icons.chevronLeft}
                        </button>
                        <span className="calendar-month">{meses[currentMonth]} {currentYear}</span>
                        <button className="btn btn-secondary btn-icon" onClick={() => navigateMonth('next')}>
                            {Icons.chevronRight}
                        </button>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setCurrentMonth(today.getMonth())
                            setCurrentYear(today.getFullYear())
                        }}
                    >
                        Hoy
                    </button>
                </div>

                <div className="calendar-grid">
                    {diasSemana.map(dia => (
                        <div key={dia} className="calendar-day-header">{dia}</div>
                    ))}

                    {calendarDays.map((item, idx) => {
                        const dayEnvios = !item.otherMonth ? getEnviosForDay(item.day) : []
                        const isDragOver = dragOverDay === item.day && !item.otherMonth
                        const dayStatus = !item.otherMonth ? getDayStatus(item.day) : null
                        return (
                            <div
                                key={idx}
                                className={`calendar-day ${item.otherMonth ? 'other-month' : ''} ${!item.otherMonth && isToday(item.day) ? 'today' : ''} ${isDragOver ? 'drag-over' : ''} ${dayStatus || ''}`}
                                onClick={() => handleDayClick(item.day, item.otherMonth)}
                                onDragOver={(e) => handleDragOver(e, item.day, item.otherMonth)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, item.day, item.otherMonth)}
                                style={{
                                    cursor: item.otherMonth ? 'default' : 'pointer',
                                    position: 'relative',
                                    backgroundColor: isDragOver ? 'var(--accent-soft)' : undefined,
                                    border: isDragOver ? '2px dashed var(--accent-primary)' : undefined
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="calendar-day-number">{item.day}</span>
                                    {!item.otherMonth && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => { e.stopPropagation(); handleDayClick(item.day, false) }}
                                            style={{
                                                width: 18,
                                                height: 18,
                                                padding: 0,
                                                minWidth: 'auto',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                                opacity: 0.8,
                                                transition: 'all 0.2s',
                                                lineHeight: 0, /* Ensure no text height interference */
                                                background: 'var(--accent-primary)', /* Ensure red background */
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                                            title="Agregar envío"
                                        >
                                            <div style={{ transform: 'scale(0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.plus}</div>
                                        </button>
                                    )}
                                </div>
                                <div className="calendar-envios">
                                    {dayEnvios.map(envio => (
                                        <div
                                            key={envio.id}
                                            className={`calendar-envio ${envio.tematicaCategoria.toLowerCase()} ${draggedEnvio?.id === envio.id ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, envio)}
                                            onDragEnd={handleDragEnd}
                                            onClick={(e) => { e.stopPropagation(); setSelectedEnvio(envio) }}
                                            onMouseEnter={(e) => {
                                                if (envio.graficaUsada) {
                                                    setHoveredImage({
                                                        url: envio.graficaUsada,
                                                        title: envio.tematicaNombre,
                                                        x: e.clientX,
                                                        y: e.clientY
                                                    })
                                                }
                                            }}
                                            onMouseMove={(e) => {
                                                if (hoveredImage) {
                                                    setHoveredImage(prev => ({
                                                        ...prev,
                                                        x: e.clientX,
                                                        y: e.clientY
                                                    }))
                                                }
                                            }}
                                            onMouseLeave={() => setHoveredImage(null)}
                                            style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                cursor: 'grab',
                                                opacity: draggedEnvio?.id === envio.id ? 0.5 : 1
                                            }}
                                            title={`Arrastra para mover a otro día${envio.enviado ? ' • Enviado' : ' • Pendiente'}`}
                                        >
                                            {/* Indicador de estado */}
                                            <span style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: envio.enviado ? '#34c759' : '#ff9500',
                                                flexShrink: 0,
                                                marginRight: 4
                                            }} />
                                            {envio.observaciones && <span style={{ opacity: 0.7 }}>{Icons.note}</span>}
                                            <span style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {envio.tematicaNombre}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {selectedEnvio && (
                <EnvioDetailModal
                    envio={selectedEnvio}
                    onClose={() => setSelectedEnvio(null)}
                    onUpdate={handleUpdateEnvio}
                    onDelete={handleDeleteEnvio}
                />
            )}

            {selectedDate && (
                <AgendaModal
                    selectedDate={selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}

            <FloatingPreview image={hoveredImage} position={hoveredImage ? { x: hoveredImage.x, y: hoveredImage.y } : null} />

        </div>
    )
}

// ========================================
// RESUMEN VIEW
// ========================================

function ResumenView() {
    const { envios, currentMonth, currentYear, tematicas } = useApp()

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    const enviosMes = envios
        .filter(e => {
            const [year, month] = e.fecha.split('-').map(Number)
            return (month - 1) === currentMonth && year === currentYear
        })
        .sort((a, b) => a.fecha.localeCompare(b.fecha))

    const conObservaciones = enviosMes.filter(e => e.observaciones && e.observaciones.trim())

    const byCategory = Object.keys(CATEGORIAS).map(cat => ({
        categoria: cat,
        ...CATEGORIAS[cat],
        cantidad: enviosMes.filter(e => e.tematicaCategoria === cat).length
    }))

    const maxCantidad = Math.max(...byCategory.map(c => c.cantidad), 1)

    return (
        <div className="main-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Resumen del Mes</h1>
                    <p className="page-subtitle">{meses[currentMonth]} {currentYear}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{enviosMes.length}</div>
                    <div className="stat-label">Envíos programados</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{conObservaciones.length}</div>
                    <div className="stat-label">Con observaciones</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{new Set(enviosMes.map(e => e.fecha)).size}</div>
                    <div className="stat-label">Días con envíos</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-lg)' }}>
                {/* Distribution Chart */}
                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>Distribución por categoría</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {byCategory.map(cat => (
                            <div key={cat.categoria}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                                    <span style={{ color: cat.color, fontWeight: 500 }}>{cat.nombre}</span>
                                    <span className="text-muted">{cat.cantidad}</span>
                                </div>
                                <div style={{
                                    height: 8,
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-full)',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${(cat.cantidad / maxCantidad) * 100}%`,
                                        height: '100%',
                                        background: cat.color,
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Observations */}
                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>Observaciones pendientes</h3>
                    {conObservaciones.length === 0 ? (
                        <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
                            {Icons.check}
                            <p>No hay observaciones pendientes</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {conObservaciones.map(envio => {
                                const cat = CATEGORIAS[envio.tematicaCategoria]
                                return (
                                    <div
                                        key={envio.id}
                                        style={{
                                            padding: 'var(--space-md)',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-md)',
                                            borderLeft: `3px solid ${cat.color}`
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                                            <strong>{envio.tematicaNombre}</strong>
                                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                                {new Date(envio.fecha).toLocaleDateString('es-CL')}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {envio.observaciones}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="card mt-lg" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Timeline del mes</h3>
                {enviosMes.length === 0 ? (
                    <div className="empty-state">
                        {Icons.calendar}
                        <p>No hay envíos programados para este mes</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {enviosMes.map(envio => {
                            const cat = CATEGORIAS[envio.tematicaCategoria]
                            const fecha = new Date(envio.fecha)
                            return (
                                <div
                                    key={envio.id}
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--space-md)',
                                        alignItems: 'center',
                                        padding: 'var(--space-md)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-subtle)'
                                    }}
                                >
                                    <div style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 'var(--radius-md)',
                                        background: cat.bgColor,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: cat.color }}>
                                            {fecha.getDate()}
                                        </span>
                                        <span style={{ fontSize: '0.625rem', color: cat.color, textTransform: 'uppercase' }}>
                                            {fecha.toLocaleDateString('es-CL', { weekday: 'short' })}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                            <span className="badge" style={{ background: cat.bgColor, color: cat.color }}>
                                                {cat.nombre}
                                            </span>
                                            <h4 style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {envio.tematicaNombre}
                                            </h4>
                                        </div>
                                        {envio.observaciones && (
                                            <p style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--text-muted)',
                                                marginTop: 'var(--space-xs)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                📝 {envio.observaciones}
                                            </p>
                                        )}
                                    </div>
                                    {envio.graficaUsada && (
                                        <div style={{
                                            width: 80,
                                            height: 50,
                                            borderRadius: 'var(--radius-sm)',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}>
                                            <img
                                                src={envio.graficaUsada}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

        </div>
    )
}

// ========================================
// MAIN APP COMPONENT
// ========================================

function App() {
    const [activeView, setActiveView] = useState('tematicas')
    // Detectar si es mobile al cargar y cerrar sidebar por defecto
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth > 768
        }
        return true
    })
    const [tematicas, setTematicas] = useState([])
    const [envios, setEnvios] = useState([])
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(true)
    const [toasts, setToasts] = useState([])

    const addToast = (message, type = 'info', title = 'Notificación') => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, message, type, title }])
        setTimeout(() => removeToast(id), 5000)
    }

    // Efecto para detectar cambios de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false)
            }
        }
        
        window.addEventListener('resize', handleResize)
        // Verificar al montar
        handleResize()
        
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    // Load data from Supabase on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('🔄 Starting to load data from Supabase...')

                // Fetch all data including grafica_url (now URLs, not base64, so fast!)
                const [tematicasRes, enviosRes] = await Promise.all([
                    supabase.from('tematicas').select('id, nombre, categoria, grafica_url, created_at'),
                    supabase.from('envios').select('*')
                ])

                console.log('📦 Tematicas Response:', tematicasRes)
                console.log('📦 Envios Response:', enviosRes)

                if (tematicasRes.error) {
                    console.error('❌ Tematicas Error:', tematicasRes.error)
                }

                if (tematicasRes.data && tematicasRes.data.length > 0) {
                    console.log('✅ Tematicas loaded:', tematicasRes.data.length)
                    const sortedTematicas = tematicasRes.data.map(t => ({
                        id: t.id,
                        nombre: t.nombre,
                        categoria: t.categoria,
                        graficaActual: t.grafica_url, // Now a URL, not base64
                        createdAt: t.created_at
                    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                    setTematicas(sortedTematicas)
                } else {
                    console.warn('⚠️ No tematicas data received or empty array')
                }

                if (enviosRes.data && enviosRes.data.length > 0) {
                    const sortedEnvios = enviosRes.data.map(e => ({
                        id: e.id,
                        tipo: e.tipo,
                        tematicaId: e.tematica_id,
                        tematicaNombre: e.tematica_nombre,
                        tematicaCategoria: e.tematica_categoria,
                        descripcion: e.descripcion,
                        basesSeleccionadas: e.bases_seleccionadas || [],
                        usaDataExtension: e.usa_data_extension,
                        nombreDataExtension: e.nombre_data_extension,
                        fecha: e.fecha,
                        observaciones: e.observaciones,
                        graficaUsada: e.grafica_url,
                        estado: e.estado,
                        createdAt: e.created_at
                    })).sort((a, b) => a.fecha.localeCompare(b.fecha))

                    setEnvios(sortedEnvios)
                }
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Database operations for tematicas
    const dbOperations = {
        async insertTematica(item) {
            const { error } = await supabase.from('tematicas').insert({
                id: item.id,
                nombre: item.nombre,
                categoria: item.categoria,
                grafica_url: item.graficaActual
            })
            if (error) console.error('Insert error:', error)
        },
        async updateTematica(item) {
            const { error } = await supabase.from('tematicas').update({
                nombre: item.nombre,
                categoria: item.categoria,
                grafica_url: item.graficaActual
            }).eq('id', item.id)
            if (error) console.error('Update error:', error)
        },
        async deleteTematica(id) {
            const { error } = await supabase.from('tematicas').delete().eq('id', id)
            if (error) console.error('Delete error:', error)
        },
        async insertEnvio(item) {
            const { error } = await supabase.from('envios').insert({
                id: item.id,
                tipo: item.tipo || 'tematica',
                tematica_id: item.tematicaId,
                tematica_nombre: item.tematicaNombre,
                tematica_categoria: item.tematicaCategoria,
                descripcion: item.descripcion,
                bases_seleccionadas: item.basesSeleccionadas,
                usa_data_extension: item.usaDataExtension,
                nombre_data_extension: item.nombreDataExtension,
                fecha: item.fecha,
                observaciones: item.observaciones,
                grafica_url: item.graficaUsada,
                estado: item.estado
            })
            if (error) console.error('Insert envio error:', error)
        },
        async updateEnvio(item) {
            const { error } = await supabase.from('envios').update({
                observaciones: item.observaciones,
                grafica_url: item.graficaUsada,
                estado: item.estado
            }).eq('id', item.id)
            if (error) console.error('Update envio error:', error)
        },
        async deleteEnvio(id) {
            const { error } = await supabase.from('envios').delete().eq('id', id)
            if (error) console.error('Delete envio error:', error)
        }
    }

    // Smart setTematicas that syncs based on operation type
    const setTematicasWithSync = (updater, operation = null, item = null) => {
        setTematicas(prev => {
            const newTematicas = typeof updater === 'function' ? updater(prev) : updater

            // Detect operation automatically if not specified
            if (!operation) {
                if (newTematicas.length > prev.length) {
                    // Find new item
                    const newItem = newTematicas.find(t => !prev.find(p => p.id === t.id))
                    if (newItem) dbOperations.insertTematica(newItem)
                } else if (newTematicas.length < prev.length) {
                    // Find deleted item
                    const deletedItem = prev.find(p => !newTematicas.find(t => t.id === p.id))
                    if (deletedItem) dbOperations.deleteTematica(deletedItem.id)
                } else {
                    // Find updated item
                    for (const newItem of newTematicas) {
                        const oldItem = prev.find(p => p.id === newItem.id)
                        if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
                            dbOperations.updateTematica(newItem)
                            break
                        }
                    }
                }
            }

            return newTematicas
        })
    }

    // Smart setEnvios that syncs based on operation type
    const setEnviosWithSync = (updater) => {
        setEnvios(prev => {
            const newEnvios = typeof updater === 'function' ? updater(prev) : updater

            if (newEnvios.length > prev.length) {
                const newItem = newEnvios.find(e => !prev.find(p => p.id === e.id))
                if (newItem) dbOperations.insertEnvio(newItem)
            } else if (newEnvios.length < prev.length) {
                const deletedItem = prev.find(p => !newEnvios.find(e => e.id === p.id))
                if (deletedItem) dbOperations.deleteEnvio(deletedItem.id)
            } else {
                for (const newItem of newEnvios) {
                    const oldItem = prev.find(p => p.id === newItem.id)
                    if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
                        dbOperations.updateEnvio(newItem)
                        break
                    }
                }
            }

            return newEnvios
        })
    }

    const contextValue = {
        tematicas, setTematicas: setTematicasWithSync,
        envios, setEnvios: setEnviosWithSync,
        currentMonth, setCurrentMonth,
        currentYear, setCurrentYear,
        addToast
    }

    if (loading) {
        return (
            <div className="emailing-planner-app" style={{
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 50,
                        height: 50,
                        margin: '0 auto 1rem',
                        border: '3px solid var(--border-subtle)',
                        borderTopColor: 'var(--accent-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p>Cargando datos...</p>
                </div>
            </div>
        )
    }

    return (
        <AppContext.Provider value={contextValue}>
            <div className="emailing-planner-app">
                <div className="layout">
                    <ToastContainer toasts={toasts} removeToast={removeToast} />
                    
                    {/* Overlay para cerrar sidebar en mobile */}
                    <div 
                        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    />
                    
                    <Sidebar
                        activeView={activeView}
                        setActiveView={setActiveView}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    {activeView === 'tematicas' && <TematicasView />}
                    {activeView === 'calendario' && <CalendarioView />}
                    {activeView === 'resumen' && <ResumenView />}

                    <MobileNav activeView={activeView} setActiveView={setActiveView} />

                    {/* Mobile menu button */}
                    <button
                        className="btn btn-primary btn-icon mobile-menu-btn"
                        style={{
                            position: 'fixed',
                            top: 'var(--space-md)',
                            left: 'var(--space-md)',
                            zIndex: 200
                        }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? Icons.x : Icons.menu}
                    </button>
                </div>
            </div>
        </AppContext.Provider>
    )
}

export default App
