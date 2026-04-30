/**
 * Atomic Academy — Video Seed
 * Carga los cursos con videos reales de demostración
 * Ejecutar con: node prisma/seed-videos.js
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🎬 Cargando videos de demostración en Atomic Academy...')

    // ─── Categorías y Cursos con Videos ──────────────────────────────────────

    const coursesData = [
        {
            category: { name: 'Reparación de Celulares', slug: 'reparacion-celulares' },
            course: {
                title: 'Reparación de Smartphones Android',
                slug: 'reparacion-smartphones-android',
                description: 'Aprende a diagnosticar y reparar los problemas más comunes en dispositivos Android: pantallas, baterías, conectores y más.',
                imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1200&auto=format&fit=crop',
                published: true
            },
            lessons: [
                {
                    title: 'Introducción al Servicio Técnico Profesional',
                    slug: 'intro-servicio-tecnico',
                    content: '<h2>Bienvenido al Curso</h2><p>En este módulo conocerás las herramientas básicas, medidas de seguridad y metodología de trabajo profesional en reparación de dispositivos móviles.</p><ul><li>Herramientas esenciales</li><li>Estación de trabajo ESD</li><li>Diagnóstico inicial</li></ul>',
                    videoUrl: 'https://www.youtube.com/watch?v=VIkAb_LwIhU',
                    order: 1
                },
                {
                    title: 'Cambio de Pantalla — Paso a Paso',
                    slug: 'cambio-pantalla-paso-paso',
                    content: '<h2>Reemplazo de Display</h2><p>Proceso completo para remover y reinstalar una pantalla LCD/AMOLED correctamente, evitando daños al flex y al touchscreen.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=c3L8MiUcAWY',
                    order: 2
                },
                {
                    title: 'Diagnóstico de Placa Base',
                    slug: 'diagnostico-placa-base',
                    content: '<h2>Diagnóstico Avanzado</h2><p>Uso de multímetro digital para medir tensiones, continuidad y detectar componentes dañados en la placa madre.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    order: 3
                },
                {
                    title: 'Reemplazo de Batería y Conector de Carga',
                    slug: 'reemplazo-bateria-conector',
                    content: '<h2>Batería y Puerto USB-C</h2><p>Técnicas seguras para extraer baterías pegadas, medir capacidad real y soldar conectores tipo-C.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
                    order: 4
                },
            ]
        },
        {
            category: { name: 'Arquitectura de Redes', slug: 'arquitectura-redes' },
            course: {
                title: 'Redes desde Cero — Cisco CCNA Foundation',
                slug: 'redes-cisco-ccna-foundation',
                description: 'Fundamentos de networking: protocolos, topologías, switching, routing básico y configuración de equipos Cisco para nivel entry-level.',
                imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
                published: true
            },
            lessons: [
                {
                    title: 'Modelos OSI y TCP/IP — Fundamentos',
                    slug: 'modelos-osi-tcpip',
                    content: '<h2>La Base de Todo Networking</h2><p>Entendimiento profundo de las 7 capas del modelo OSI y cómo se relacionan con el modelo TCP/IP práctico. Análisis de tramas con Wireshark.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=vv4y_uOneC0',
                    order: 1
                },
                {
                    title: 'Subnetting IPv4 — Cálculo Profesional',
                    slug: 'subnetting-ipv4',
                    content: '<h2>Subneteo Eficiente</h2><p>Aprende a calcular subredes, máscaras CIDR, rangos de host y broadcast de forma rápida. Ejercicios prácticos con redes reales.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=ecCuyq-Wprc',
                    order: 2
                },
                {
                    title: 'Configuración Básica de Switch Cisco',
                    slug: 'configuracion-switch-cisco',
                    content: '<h2>CLI de Cisco IOS</h2><p>Primeros comandos en CLI: modo privilegiado, configuración de hostname, contraseñas, VLANs y trunkeo entre switches.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=IP7dHrJIYD4',
                    order: 3
                },
                {
                    title: 'Routing Estático y Dinámico — OSPF Básico',
                    slug: 'routing-estatico-ospf',
                    content: '<h2>Enrutamiento Profesional</h2><p>Configuración de rutas estáticas, protocolo OSPF area 0 y verificación de tablas de routing en routers Cisco.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=kfCBhiHrRfU',
                    order: 4
                },
                {
                    title: 'Seguridad en Redes — ACLs y Port Security',
                    slug: 'seguridad-acl-port-security',
                    content: '<h2>Control de Acceso</h2><p>Implementación de listas de control de acceso (ACL estándar y extendida) y port security en switches para prevenir accesos no autorizados.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=gW6iYs700gA',
                    order: 5
                },
            ]
        },
        {
            category: { name: 'Ciberseguridad', slug: 'cyber-seguridad' },
            course: {
                title: 'Hacking Ético — Introducción Práctica',
                slug: 'hacking-etico-intro',
                description: 'Principios de seguridad ofensiva y defensiva: reconocimiento, escaneo, explotación responsable y reporte de vulnerabilidades. Laboratorio con Kali Linux.',
                imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
                published: true
            },
            lessons: [
                {
                    title: 'Entorno Kali Linux — Instalación y Configuración',
                    slug: 'kali-linux-instalacion',
                    content: '<h2>Tu Laboratorio de Seguridad</h2><p>Instalación de Kali Linux en VirtualBox/VMware, configuración de red NAT y bridged, herramientas pre-instaladas esenciales.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=lZAoFs75_cs',
                    order: 1
                },
                {
                    title: 'Reconocimiento con OSINT y Nmap',
                    slug: 'reconocimiento-osint-nmap',
                    content: '<h2>Fase de Reconocimiento</h2><p>Técnicas de OSINT (información pública), escaneo de puertos con Nmap, detección de versiones y sistema operativo.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=4t4kBkMsDbQ',
                    order: 2
                },
                {
                    title: 'Metasploit Framework — Conceptos Básicos',
                    slug: 'metasploit-basico',
                    content: '<h2>Explotación Controlada</h2><p>Uso de Metasploit en entorno controlado: módulos de exploit, payloads, sessions y post-explotación básica.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=8lR27r8Y3oo',
                    order: 3
                },
            ]
        },
        {
            category: { name: 'Reparación de Laptops', slug: 'reparacion-laptops' },
            course: {
                title: 'Mantenimiento y Reparación de Laptops',
                slug: 'mantenimiento-reparacion-laptops',
                description: 'Desde limpieza preventiva hasta cambio de pasta térmica, pantallas, SSD y solución a problemas de arranque. Para técnicos en formación y profesionales.',
                imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop',
                published: true
            },
            lessons: [
                {
                    title: 'Mantenimiento Preventivo — Limpieza y Pasta Térmica',
                    slug: 'mantenimiento-preventivo-limpieza',
                    content: '<h2>Mantenimiento Base</h2><p>Proceso completo de desmontaje, limpieza de ventiladores, aplicación correcta de pasta térmica y montaje final.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=Y7MHyqmY50E',
                    order: 1
                },
                {
                    title: 'Upgrade de RAM y SSD — Mejora de Rendimiento',
                    slug: 'upgrade-ram-ssd',
                    content: '<h2>Actualización de Hardware</h2><p>Identificación de slots disponibles, compatibilidad de módulos RAM, migración de HDD a SSD y clonación de disco.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=RjJn5RcB0Cg',
                    order: 2
                },
                {
                    title: 'Diagnóstico de No Enciende — Metodología',
                    slug: 'diagnostico-no-enciende',
                    content: '<h2>Árbol de Diagnóstico</h2><p>Metodología paso a paso para diagnosticar laptops que no encienden: PSU, batería, voltajes de placa, botón de power y BIOS.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=K1bN4YXPCBU',
                    order: 3
                },
                {
                    title: 'Reemplazo de Pantalla LCD/IPS',
                    slug: 'reemplazo-pantalla-lcd-ips',
                    content: '<h2>Cambio de Display</h2><p>Cómo identificar la referencia de pantalla, abrir el bezel sin romperlo y reconectar los cables LVDS/eDP correctamente.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=5xQ9FYNV9oQ',
                    order: 4
                },
            ]
        },
        {
            category: { name: 'Pilotaje de Drones', slug: 'drones' },
            course: {
                title: 'Piloto de Drones — Nivel Inicial',
                slug: 'piloto-drones-inicial',
                description: 'Fundamentos de vuelo, normativa aeronáutica ecuatoriana, calibración de IMU/brújula, modos de vuelo y fotografía aérea básica.',
                imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
                published: true
            },
            lessons: [
                {
                    title: 'Normativa DGAC Ecuador para Drones',
                    slug: 'normativa-dgac-drones',
                    content: '<h2>Marco Legal</h2><p>Requisitos de registro, zonas de vuelo permitidas, altitudes máximas, seguros y penalidades según la regulación aeronáutica civil ecuatoriana.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=TP82mU8BYgE',
                    order: 1
                },
                {
                    title: 'Pre-vuelo — Checklist y Calibración',
                    slug: 'prevuelo-checklist-calibracion',
                    content: '<h2>Preparación del Vuelo</h2><p>Lista de verificación pre-vuelo, calibración de IMU y brújula, verificación de propelas, batería y señal GPS mínima.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=GYYnXhxBiiQ',
                    order: 2
                },
                {
                    title: 'Primer Vuelo — Modo Principiante',
                    slug: 'primer-vuelo-modo-principiante',
                    content: '<h2>Tus Primeros Metros</h2><p>Ejercicios básicos: hover estático, avance/retroceso, laterales, rotación y aterrizaje de emergencia. Seguridad ante todo.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=RBaH55Dz2aQ',
                    order: 3
                },
            ]
        },
        {
            category: { name: 'Ventas Básicas en Línea', slug: 'ventas-online' },
            course: {
                title: 'Ventas por WhatsApp Business — Estrategia Pro',
                slug: 'ventas-whatsapp-business',
                description: 'Configura tu perfil de negocio, usa catálogos, crea mensajes automáticos efectivos y cierra ventas con técnicas de copywriting probadas.',
                imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
                published: true
            },
            lessons: [
                {
                    title: 'Configuración de WhatsApp Business Profesional',
                    slug: 'configuracion-whatsapp-business',
                    content: '<h2>Tu Vitrina Digital</h2><p>Perfil completo, catálogo de productos, horarios de atención, respuestas rápidas y etiquetas para organizar clientes.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=wOpqJBxwPcA',
                    order: 1
                },
                {
                    title: 'Copywriting para Ventas por Chat',
                    slug: 'copywriting-ventas-chat',
                    content: '<h2>El Arte del Mensaje Efectivo</h2><p>Estructura de mensajes de venta: gancho, propuesta de valor, prueba social y llamada a la acción. Plantillas probadas.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=6Nv18ZKJSWQ',
                    order: 2
                },
                {
                    title: 'Manejo de Objeciones en Tiempo Real',
                    slug: 'manejo-objeciones',
                    content: '<h2>Cómo Responder el "Está Caro"</h2><p>Técnicas de rebate para las 5 objeciones más comunes: precio, tiempo, necesidad, competencia y confianza.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=MZXFfUo-vd4',
                    order: 3
                },
                {
                    title: 'Automatización con Mensajes Programados',
                    slug: 'automatizacion-mensajes',
                    content: '<h2>Vende Mientras Duermes</h2><p>Bots básicos con WhatsApp Business API, secuencias de seguimiento y campañas de reactivación de clientes inactivos.</p>',
                    videoUrl: 'https://www.youtube.com/watch?v=Ub2MWTGPDvE',
                    order: 4
                },
            ]
        },
    ]

    // ─── Insertar en base de datos ────────────────────────────────────────────

    for (const item of coursesData) {
        console.log(`\n📂 Procesando categoría: ${item.category.name}`)

        // Upsert categoría
        const category = await prisma.academyCategory.upsert({
            where: { slug: item.category.slug },
            update: { name: item.category.name },
            create: {
                name: item.category.name,
                slug: item.category.slug,
                description: `Cursos de ${item.category.name}`,
            }
        })

        // Upsert curso
        const course = await prisma.course.upsert({
            where: { slug: item.course.slug },
            update: {
                title: item.course.title,
                description: item.course.description,
                imageUrl: item.course.imageUrl,
                published: item.course.published,
            },
            create: {
                ...item.course,
                categoryId: category.id,
            }
        })

        console.log(`  ✅ Curso: ${course.title}`)

        // Insertar lecciones (solo si no existen)
        for (const lessonData of item.lessons) {
            try {
                await prisma.lesson.upsert({
                    where: { courseId_slug: { courseId: course.id, slug: lessonData.slug } },
                    update: {
                        title: lessonData.title,
                        videoUrl: lessonData.videoUrl,
                        content: lessonData.content,
                        order: lessonData.order,
                    },
                    create: {
                        ...lessonData,
                        courseId: course.id,
                    }
                })
                console.log(`     🎬 Lección: ${lessonData.title}`)
            } catch (e) {
                console.warn(`     ⚠️  Skip: ${lessonData.title} (ya existe o error)`)
            }
        }
    }

    console.log('\n✨ Academia lista con videos. Visita /academy para ver el resultado.')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
