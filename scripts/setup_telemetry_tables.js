const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setup() {
  console.log('--- Configurando Tablas de Telemetría y Carritos en PostgreSQL ---');

  // 1. Tabla de Logs de Visitantes / Píxel de Tráfico
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS visitor_logs (
      id VARCHAR(64) PRIMARY KEY,
      visitor_id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64),
      user_email VARCHAR(255),
      user_name VARCHAR(255),
      user_role VARCHAR(64) DEFAULT 'GUEST',
      path TEXT NOT NULL,
      referrer TEXT,
      utm_source VARCHAR(128),
      utm_medium VARCHAR(128),
      utm_campaign VARCHAR(128),
      utm_content VARCHAR(128),
      campaign_tag VARCHAR(64) DEFAULT 'GENERAL',
      device VARCHAR(32) DEFAULT 'desktop',
      browser VARCHAR(64),
      os VARCHAR(64),
      ip VARCHAR(64),
      city VARCHAR(128),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('✓ Tabla visitor_logs creada o verificada');

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON visitor_logs(created_at DESC);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor_id ON visitor_logs(visitor_id);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_visitor_logs_campaign_tag ON visitor_logs(campaign_tag);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_visitor_logs_user_role ON visitor_logs(user_role);`);
  console.log('✓ Índices de visitor_logs creados');

  // 2. Tabla de Carritos Casi Comprados / Carritos Abandonados
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS cart_telemetry (
      id VARCHAR(64) PRIMARY KEY,
      visitor_id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64),
      user_email VARCHAR(255),
      user_name VARCHAR(255),
      user_phone VARCHAR(64),
      items_data JSONB NOT NULL DEFAULT '[]'::jsonb,
      total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
      items_count INT NOT NULL DEFAULT 0,
      source_url TEXT,
      campaign_tag VARCHAR(64) DEFAULT 'GENERAL',
      status VARCHAR(32) NOT NULL DEFAULT 'ABANDONADO',
      last_action VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('✓ Tabla cart_telemetry creada o verificada');

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_cart_telemetry_updated_at ON cart_telemetry(updated_at DESC);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_cart_telemetry_visitor_id ON cart_telemetry(visitor_id);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_cart_telemetry_status ON cart_telemetry(status);`);
  console.log('✓ Índices de cart_telemetry creados');

  console.log('--- Setup de Telemetría Completado Exitosamente ---');
}

setup()
  .catch(err => {
    console.error('Error en setup:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
