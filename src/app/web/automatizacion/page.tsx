import { Metadata } from 'next';
import AutomatizacionClient from './PageClient';

export const metadata: Metadata = {
  title: 'Atomic Systems | Bot Inteligente 24/7 ($99/mes) - Atiende, Factura SRI, Llama y Agenda',
  description: 'Automatización completa para tu negocio: Bot de atención en WhatsApp 24/7, cotizaciones en PDF, facturación SRI, llamadas con voz IA y agendamiento automático por solo $99 al mes.',
};

export default function AutomatizacionPage() {
  return <AutomatizacionClient />;
}
