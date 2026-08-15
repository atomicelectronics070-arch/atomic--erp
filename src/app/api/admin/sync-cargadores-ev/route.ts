export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MARGEN = 0.15; // 15% de margen comercial

const EV_CHARGERS_CATALOG = [
  {
    name: 'Cargador Portátil EV Wallbox Go 7.4 kW (Monofásico 32A)',
    sku: 'EV-GO-7KW',
    costPrice: 390.00,
    images: JSON.stringify([
      '/img/cargadores/ev_real_1.jpeg',
      '/img/cargadores/ev_real_2.jpeg'
    ]),
    description: `<h2>Cargador Portátil EV Wallbox Go 7.4 kW</h2>
<p>Cargador portátil de alto rendimiento para vehículos eléctricos e híbridos enchufables. Corriente regulable de 8A a 32A con pantalla LCD integrada en tiempo real y certificación de seguridad europea TÜV Rheinland.</p>
<h3>Características Principales</h3>
<ul>
<li>Potencia máxima de carga: 7.4 kW (hasta 45 km de autonomía por hora de carga)</li>
<li>Corriente ajustable: 8A / 10A / 13A / 16A / 32A</li>
<li>Conector Universal: Tipo 2 (IEC 62196) o GB/T según requerimiento</li>
<li>Pantalla LCD a color con monitoreo de voltaje, temperatura, kWh cargados y tiempo</li>
<li>Certificación de estanqueidad IP66 e impacto IK10 (resistente a lluvia e intemperie)</li>
<li>Protección eléctrica integrada: RCD Tipo A + DC 6mA (protección fuga a tierra)</li>
<li>Normativa de fabricación europea CE & TÜV Rheinland</li>
</ul>`,
    specs: JSON.stringify({
      potencia: '7.4 kW Monofásico (220V AC)',
      corriente: 'Ajustable 8A - 32A',
      conector: 'Tipo 2 / GB/T / Type 1',
      proteccion: 'IP66 / IK10 (Impermeable y anti-impacto)',
      seguridad: 'Fuga a tierra RCD AC 30mA + DC 6mA',
      pantalla: 'OLED 1.4" Monitoreo en vivo',
      certificacion: 'CE, TÜV Rheinland, RoHS (Calidad Europea)',
      garantia: '3 Años de garantía oficial de fábrica',
    }),
    stock: 25,
  },
  {
    name: 'Estación de Carga Smart EV Pulsar Pro 11 kW (Trifásico 16A)',
    sku: 'EV-PULSAR-11KW',
    costPrice: 680.00,
    images: JSON.stringify([
      '/img/cargadores/ev_real_3.jpeg',
      '/img/cargadores/ev_real_4.jpeg'
    ]),
    description: `<h2>Estación Smart EV Pulsar Pro 11 kW</h2>
<p>Wallbox inteligente residencial y comercial con conectividad WiFi/Bluetooth, control vía App móvil iOS/Android y balanceo dinámico de carga Power Boost para evitar sobrecargas en la red doméstica.</p>
<h3>Características Principales</h3>
<ul>
<li>Potencia trifásica inteligente de 11 kW (hasta 75 km de autonomía por hora de carga)</li>
<li>Control total desde la App: programación horaria, inicio/paro remoto y reportes de consumo</li>
<li>Lector de tarjetas RFID integrado para autenticación de usuarios autorizados</li>
<li>Tecnología Power Boost: ajusta automáticamente la velocidad de carga según el consumo de tu hogar</li>
<li>Chasis ultra compacto de ingeniería europea con acabado matte anti-rayaduras</li>
<li>Compatible con el 100% de vehículos eléctricos del mercado (BYD, Tesla, BMW, Audi, Hyundai, Kia, MG)</li>
</ul>`,
    specs: JSON.stringify({
      potencia: '11 kW Trifásico (380V - 400V AC)',
      corriente: '16A por fase (ajustable)',
      conectividad: 'WiFi 2.4GHz, Bluetooth 5.0, Ethernet RJ45',
      autenticacion: 'App Móvil + Tarjetas RFID (3 incluidas)',
      proteccion: 'IP65 Nema 4X (Exterior e Interior)',
      balanceo: 'Power Boost (Sensor dinámico de consumo)',
      certificacion: 'CE, IEC 61851-1, ISO 9001 (Fabricación Europea)',
      garantia: '3 Años de garantía oficial',
    }),
    stock: 18,
  },
  {
    name: 'Estación Comercial EV Ultra Fast 22 kW (Trifásico Dual 32A)',
    sku: 'EV-ULTRA-22KW',
    costPrice: 1250.00,
    images: JSON.stringify([
      '/img/cargadores/ev_real_5.jpeg'
    ]),
    description: `<h2>Estación Comercial EV Ultra Fast 22 kW</h2>
<p>Estación de carga pesada diseñada para hoteles, centros comerciales, flotas corporativas y parqueaderos públicos. Equipada con protocolo abierto OCPP 1.6J para monetización y cobranza automática de carga.</p>
<h3>Características Principales</h3>
<ul>
<li>Potencia máxima de 22 kW (Carga Ultra Rápida AC en trifásico 32A)</li>
<li>Protocolo Abierto OCPP 1.6J / 2.0.1: Integración con cualquier plataforma de cobro y gestión de flotas</li>
<li>Pantalla táctil grado industrial de 7" con guía interactiva de usuario</li>
<li>Doble toma de carga (Manguera conector Tipo 2 de 5m + Socket adicional)</li>
<li>Contador de energía MID de alta precisión certificado para facturación de electricidad</li>
<li>Carcasa de acero inoxidable y policarbonato antivandálico IK10</li>
</ul>`,
    specs: JSON.stringify({
      potencia: '22 kW Trifásico (400V AC 32A)',
      protocolo: 'OCPP 1.6 JSON para facturación comercial',
      pantalla: 'Táctil HD 7" Resistente al calor y lluvia',
      conectividad: '4G LTE SIM + Ethernet + WiFi',
      medicion: 'Medidor MID certificado Clase 1',
      proteccion: 'IK10 Antivandálico / IP65 Intemperie',
      certificacion: 'CE, TÜV, IEC 61851-22 (Estándar Europeo)',
      garantia: '3 Años de garantía comercial con soporte local',
    }),
    stock: 10,
  },
  {
    name: 'Cargador de Viaje Compact EV Travel 3.7 kW (Universal 16A)',
    sku: 'EV-TRAVEL-3.7KW',
    costPrice: 240.00,
    images: JSON.stringify([
      '/img/cargadores/ev_real_6.jpeg'
    ]),
    description: `<h2>Cargador de Viaje Compact EV Travel 3.7 kW</h2>
<p>El compañero de viaje indispensable. Conéctalo en cualquier tomacorriente doméstico de 110V o 220V para recargar tu vehículo en cualquier emergencia durante tus viajes.</p>
<h3>Características Principales</h3>
<ul>
<li>Potencia de carga: 3.7 kW (16A a 220V) / 1.8 kW (16A a 110V)</li>
<li>Incluye adaptadores intercambiables para toma industrial CEE y toma estándar residencial NEMA</li>
<li>Cable reinforced de TPU ultra flexible de 6 metros resistente al aplastamiento de neumáticos</li>
<li>Sensor de temperatura integrado en el enchufe para prevenir sobrecalentamiento de la pared</li>
<li>Maletín rígido e impermeable de transporte incluido de regalo</li>
</ul>`,
    specs: JSON.stringify({
      potencia: '3.7 kW (220V) / 1.8 kW (110V)',
      corriente: 'Ajustable 6A / 10A / 13A / 16A',
      cable: '6 Metros TPU alta flexibilidad',
      estuche: 'Maletín rígido shockproof incluido',
      seguridad: 'Auto-desconexión térmica a 75°C',
      certificacion: 'CE, RoHS, IP67',
      garantia: '3 Años de garantía de fábrica',
    }),
    stock: 30,
  },
];

export async function GET() {
  try {
    let categoria = await prisma.category.findFirst({
      where: { name: { contains: 'cargador', mode: 'insensitive' } },
    });
    if (!categoria) {
      categoria = await prisma.category.create({
        data: {
          name: 'Cargadores para Autos Eléctricos',
          slug: 'cargadores-autos-electricos',
        },
      });
    }

    const log: string[] = [];
    let updated = 0;
    let inserted = 0;

    for (const rawProd of EV_CHARGERS_CATALOG) {
      const salePrice = Math.round(rawProd.costPrice * (1 + MARGEN) * 100) / 100;
      const compareAt = Math.round(salePrice * 1.18 * 100) / 100;

      let existing = await prisma.product.findFirst({
        where: { sku: rawProd.sku },
      }) ?? await prisma.product.findFirst({
        where: { name: { equals: rawProd.name, mode: 'insensitive' } },
      });

      const productData = {
        name: rawProd.name,
        sku: rawProd.sku,
        price: salePrice,
        compareAtPrice: compareAt,
        images: rawProd.images,
        description: rawProd.description,
        specs: rawProd.specs,
        stock: rawProd.stock,
        provider: 'Atomic EV Europe',
        categoryId: categoria.id,
        isDeleted: false,
      };

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: productData,
        });
        log.push(`UPDATED (Margen 15%): ${rawProd.name} (Costo: $${rawProd.costPrice} -> Venta: $${salePrice})`);
        updated++;
      } else {
        await prisma.product.create({
          data: productData,
        });
        log.push(`INSERTED (Margen 15%): ${rawProd.name} (Venta: $${salePrice})`);
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      margin_applied: '15%',
      inserted,
      updated,
      total_ev_chargers: EV_CHARGERS_CATALOG.length,
      log,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
