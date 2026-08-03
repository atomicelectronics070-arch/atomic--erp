'use client'

import { useState, useEffect } from 'react'
import contentCalendar from '@/data/nfc-content-calendar.json'

export default function NfcCampaignDashboard() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState<any>(null)
    const [message, setMessage] = useState('')

    const [form, setForm] = useState({
        metaPageId: '',
        metaPageToken: '',
        campaignStartDate: '',
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const res = await fetch('/api/social-settings')
            const data = await res.json()
            if (data) {
                setSettings(data)
                setForm({
                    metaPageId: data.metaPageId || '',
                    metaPageToken: data.metaPageToken || '',
                    campaignStartDate: data.campaignStartDate
                        ? new Date(data.campaignStartDate).toISOString().split('T')[0]
                        : '',
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    async function saveSettings() {
        setSaving(true)
        setMessage('')
        try {
            const res = await fetch('/api/social-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (data.success) {
                setMessage('✅ Configuración guardada correctamente.')
                fetchSettings()
            } else {
                setMessage(`❌ Error: ${data.error}`)
            }
        } catch (e: any) {
            setMessage(`❌ Error: ${e.message}`)
        } finally {
            setSaving(false)
        }
    }

    async function triggerPost() {
        setTesting(true)
        setTestResult(null)
        try {
            const res = await fetch('/api/cron/post-nfc-content')
            const data = await res.json()
            setTestResult(data)
        } catch (e: any) {
            setTestResult({ success: false, error: e.message })
        } finally {
            setTesting(false)
        }
    }

    // Calculate current campaign day
    const campaignDay = settings?.campaignStartDate
        ? Math.floor((Date.now() - new Date(settings.campaignStartDate).getTime()) / (1000 * 60 * 60 * 24))
        : -1

    const currentContent = campaignDay >= 0 ? contentCalendar[campaignDay % contentCalendar.length] : null

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div style={{ color: '#E8341A', fontSize: 24 }}>⚡ Cargando...</div>
        </div>
    )

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0F1923',
            color: 'white',
            padding: '32px',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{
                    fontSize: 36,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '-2px',
                    margin: 0
                }}>
                    ATOMIC<span style={{ color: '#E8341A' }}>.</span> CAMPAÑA NFC
                </h1>
                <p style={{ color: '#888', marginTop: 8, fontSize: 16 }}>
                    Plan de publicación automática de 30 días en Facebook
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1200 }}>

                {/* Config Panel */}
                <div style={{
                    background: '#1A2535',
                    border: '1px solid #2A3545',
                    borderRadius: 16,
                    padding: 28
                }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#E8341A' }}>
                        🔑 Credenciales de Facebook
                    </h2>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Facebook Page ID
                        </label>
                        <input
                            type="text"
                            value={form.metaPageId}
                            onChange={e => setForm(f => ({ ...f, metaPageId: e.target.value }))}
                            placeholder="Ej: 123456789012345"
                            style={{
                                width: '100%',
                                background: '#0F1923',
                                border: '1px solid #2A3545',
                                borderRadius: 8,
                                padding: '12px 16px',
                                color: 'white',
                                fontSize: 14,
                                boxSizing: 'border-box'
                            }}
                        />
                        <p style={{ color: '#666', fontSize: 12, marginTop: 6 }}>
                            Encuéntralo en Configuración de tu Página de Facebook
                        </p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Page Access Token (larga duración)
                        </label>
                        <textarea
                            value={form.metaPageToken}
                            onChange={e => setForm(f => ({ ...f, metaPageToken: e.target.value }))}
                            placeholder="EAAxxxxxxxx... (Token de larga duración de tu página)"
                            rows={4}
                            style={{
                                width: '100%',
                                background: '#0F1923',
                                border: '1px solid #2A3545',
                                borderRadius: 8,
                                padding: '12px 16px',
                                color: 'white',
                                fontSize: 12,
                                fontFamily: 'monospace',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                        <p style={{ color: '#666', fontSize: 12, marginTop: 6 }}>
                            Genera en: developers.facebook.com → Graph API Explorer → Get Page Access Token
                        </p>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Fecha de inicio de campaña
                        </label>
                        <input
                            type="date"
                            value={form.campaignStartDate}
                            onChange={e => setForm(f => ({ ...f, campaignStartDate: e.target.value }))}
                            style={{
                                width: '100%',
                                background: '#0F1923',
                                border: '1px solid #2A3545',
                                borderRadius: 8,
                                padding: '12px 16px',
                                color: 'white',
                                fontSize: 14,
                                boxSizing: 'border-box'
                            }}
                        />
                        <p style={{ color: '#666', fontSize: 12, marginTop: 6 }}>
                            Día en que empieza la publicación automática. Se publica a las 9:00 AM hora Ecuador.
                        </p>
                    </div>

                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        style={{
                            width: '100%',
                            background: '#E8341A',
                            border: 'none',
                            borderRadius: 8,
                            padding: '14px',
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: saving ? 'wait' : 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? '⏳ Guardando...' : '💾 Guardar Configuración'}
                    </button>

                    {message && (
                        <p style={{ marginTop: 16, padding: '12px 16px', background: message.startsWith('✅') ? '#0d2d1a' : '#2d0d0d', borderRadius: 8, fontSize: 14 }}>
                            {message}
                        </p>
                    )}
                </div>

                {/* Status Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Campaign Status */}
                    <div style={{
                        background: '#1A2535',
                        border: '1px solid #2A3545',
                        borderRadius: 16,
                        padding: 28
                    }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#E8341A' }}>
                            📊 Estado de la Campaña
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                            <div style={{ background: '#0F1923', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 36, fontWeight: 900, color: '#E8341A' }}>
                                    {campaignDay >= 0 ? Math.min(campaignDay + 1, 30) : 0}
                                </div>
                                <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Día actual</div>
                            </div>
                            <div style={{ background: '#0F1923', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                                <div style={{ fontSize: 36, fontWeight: 900, color: '#4CAF50' }}>
                                    {30}
                                </div>
                                <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Posts totales</div>
                            </div>
                        </div>

                        <div style={{
                            background: campaignDay >= 0 ? '#0d2d1a' : '#1a1a2a',
                            border: `1px solid ${campaignDay >= 0 ? '#1a4a2a' : '#2a2a3a'}`,
                            borderRadius: 10,
                            padding: 16,
                            marginBottom: 20
                        }}>
                            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 4 }}>ESTADO</div>
                            <div style={{ fontWeight: 700, color: campaignDay >= 0 ? '#4CAF50' : '#888' }}>
                                {campaignDay < 0
                                    ? '⏸ No iniciada — Configura la fecha de inicio'
                                    : campaignDay >= 30
                                        ? '🔁 Ciclo completado — Repitiendo contenido'
                                        : `🟢 Activa — Día ${campaignDay + 1} de 30`
                                }
                            </div>
                        </div>

                        {/* Today's Content Preview */}
                        {currentContent && (
                            <div style={{
                                background: '#0F1923',
                                border: '1px solid #2A3545',
                                borderRadius: 10,
                                padding: 16
                            }}>
                                <div style={{ fontSize: 12, color: '#E8341A', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                                    Post de Hoy (Día {campaignDay + 1})
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{currentContent.title}</div>
                                <div style={{ color: '#888', fontSize: 12, lineHeight: 1.6 }}>
                                    {currentContent.body.substring(0, 150)}...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Manual Trigger */}
                    <div style={{
                        background: '#1A2535',
                        border: '1px solid #2A3545',
                        borderRadius: 16,
                        padding: 28
                    }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#E8341A' }}>
                            🚀 Publicar Ahora (Manual)
                        </h2>
                        <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
                            Publica el post del día actual inmediatamente en tu página de Facebook, sin esperar el cron automático.
                        </p>
                        <button
                            onClick={triggerPost}
                            disabled={testing || campaignDay < 0}
                            style={{
                                width: '100%',
                                background: testing ? '#333' : '#1a4a2a',
                                border: '1px solid #2a6a3a',
                                borderRadius: 8,
                                padding: '14px',
                                color: 'white',
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: (testing || campaignDay < 0) ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                opacity: (testing || campaignDay < 0) ? 0.5 : 1
                            }}
                        >
                            {testing ? '⏳ Publicando...' : '📤 Publicar en Facebook Ahora'}
                        </button>

                        {testResult && (
                            <div style={{
                                marginTop: 16,
                                padding: '16px',
                                background: testResult.success ? '#0d2d1a' : '#2d0d0d',
                                borderRadius: 8,
                                fontSize: 13
                            }}>
                                {testResult.success ? (
                                    <>
                                        <div style={{ color: '#4CAF50', fontWeight: 700, marginBottom: 8 }}>✅ ¡Post publicado exitosamente!</div>
                                        <div style={{ color: '#aaa' }}>Día: {testResult.day}</div>
                                        <div style={{ color: '#aaa' }}>ID del Post: {testResult.postId}</div>
                                        <div style={{ color: '#aaa' }}>Publicado: {new Date(testResult.postedAt).toLocaleString('es-EC')}</div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ color: '#E8341A', fontWeight: 700, marginBottom: 8 }}>❌ Error al publicar</div>
                                        <div style={{ color: '#aaa' }}>{testResult.error}</div>
                                        {testResult.fbData && (
                                            <pre style={{ marginTop: 8, fontSize: 11, overflow: 'auto' }}>
                                                {JSON.stringify(testResult.fbData, null, 2)}
                                            </pre>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Calendar Preview */}
            <div style={{
                marginTop: 32,
                background: '#1A2535',
                border: '1px solid #2A3545',
                borderRadius: 16,
                padding: 28,
                maxWidth: 1200
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#E8341A' }}>
                    📅 Calendario de 30 Días — Vista Previa
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {contentCalendar.map((post, i) => {
                        const isToday = campaignDay >= 0 && (campaignDay % contentCalendar.length) === i
                        const isPast = campaignDay > i
                        return (
                            <div
                                key={post.day}
                                style={{
                                    background: isToday ? '#1a3a20' : '#0F1923',
                                    border: `1px solid ${isToday ? '#4CAF50' : '#2A3545'}`,
                                    borderRadius: 10,
                                    padding: 16,
                                    opacity: isPast ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{
                                        background: isToday ? '#4CAF50' : '#E8341A',
                                        color: 'white',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        padding: '3px 10px',
                                        borderRadius: 20
                                    }}>
                                        {isToday ? '📢 HOY' : `Día ${post.day}`}
                                    </span>
                                    {isPast && <span style={{ fontSize: 12, color: '#4CAF50' }}>✓ Pasado</span>}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4, marginBottom: 6 }}>
                                    {post.title}
                                </div>
                                <div style={{ color: '#666', fontSize: 11 }}>
                                    {post.hashtags.split(' ').slice(0, 3).join(' ')}...
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
