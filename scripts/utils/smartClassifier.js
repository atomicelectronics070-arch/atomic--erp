const categoryKeywords = {
    'Cable UTP': ['utp', 'rj45', 'cable de red', 'patch cord', 'cat6', 'cat5', 'bobina utp'],
    'Software & Desarrollo': ['licencia', 'windows', 'office', 'software', 'antivirus'],
    'Automatización Inteligente': ['sonoff', 'interruptor inteligente', 'enchufe inteligente', 'rele wifi', 'alexa', 'google home'],
    'Gaming & Consolas': ['gamer', 'silla gamer', 'teclado mecanico', 'mouse gamer', 'auriculares gamer'],
    'Consolas de Video Juegos': ['playstation', 'ps4', 'ps5', 'xbox', 'nintendo switch', 'consola'],
    'Alarmas': ['sirena', 'panel de alarma', 'sensor de movimiento', 'pir', 'contacto magnetico', 'sensor de humo'],
    'Antenas': ['antena', 'ubiquiti', 'mikrotik', 'punto de acceso', 'access point'],
    'Barreras Vehiculares': ['talanquera', 'barrera', 'brazo vehicular', 'motor corredizo', 'motor abatible'],
    'Camaras de Seguridad': ['camara', 'dvr', 'nvr', 'cctv', 'ptz', 'dahua', 'hikvision', 'ezviz', 'imou', 'balun'],
    'Repuestos de Laptop': ['bateria laptop', 'teclado laptop', 'pantalla laptop', 'cargador laptop', 'flex'],
    'Celulares Tablets y Computacion': ['celular', 'smartphone', 'iphone', 'tablet', 'ipad', 'laptop', 'computadora', 'ram', 'ssd', 'disco duro', 'monitor', 'impresora', 'flash', 'pendrive', 'micro sd', 'funda', 'mica', 'cable usb', 'cargador pared'],
    'Energia': ['ups', 'generador', 'bateria 12v', 'bateria gel', 'inversor', 'panel solar', 'motobomba', 'regulador', 'transformador', 'fuente de poder', 'power bank'],
    'Porteria Electronica': ['video portero', 'intercomunicador', 'citofono', 'frente de calle'],
    'Iluminacion': ['foco', 'led', 'lampara', 'luminaria', 'reflector', 'cinta led'],
    'Cerraduras Smart y Accesos': ['cerradura', 'biometrico', 'control de acceso', 'tarjeta rfid', 'chapa', 'zkteco', 'lector', 'boton de salida', 'electroiman'],
    'Servicios': ['mantenimiento', 'instalacion', 'limpiador', 'pasta termica', 'soporte tecnico', 'configuracion'],
    'Electronica para Negocios Movilidad y Deportes': ['scooter', 'pos', 'impresora termica', 'lector de barras', 'caja registradora', 'gaveta'],
    'Tienda en Linea a Medida': [],
    'Domotica Automatizacion para tu Negocio': [],
    'SOFT3 Logistics': [],
    'Ambientes': [],
    'TECNOLOGIA RESIDENCIAL': ['televisor', 'smart tv', 'licuadora', 'plancha', 'electrodomestico']
};

/**
 * Classifies a product name into one of the provided categories.
 * @param {string} productName - The name of the product
 * @param {Array} dbCategories - Array of category objects from the DB ({ id, name, ... })
 * @returns {string|null} - The ID of the best matching category, or null if no match
 */
function classifyProduct(productName, dbCategories) {
    if (!productName) return null;
    const nameLower = productName.toLowerCase();

    // 1. Try to match by keywords
    for (const [catName, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword.toLowerCase()))) {
            const matchedCat = dbCategories.find(c => c.name === catName);
            if (matchedCat) return matchedCat.id;
        }
    }

    // 2. Fallback logic: Audio / Accesorios genéricos
    if (nameLower.includes('audifono') || nameLower.includes('tws') || nameLower.includes('parlante') || nameLower.includes('bluetooth')) {
        const fallbackCat = dbCategories.find(c => c.name === 'Celulares Tablets y Computacion' || c.name === 'TECNOLOGIA RESIDENCIAL');
        if (fallbackCat) return fallbackCat.id;
    }

    // Default Fallback for anything completely unknown
    // Find 'TECNOLOGIA RESIDENCIAL' or first available generic
    const genericCat = dbCategories.find(c => c.name === 'TECNOLOGIA RESIDENCIAL');
    if (genericCat) return genericCat.id;

    return null;
}

module.exports = {
    classifyProduct,
    categoryKeywords
};
