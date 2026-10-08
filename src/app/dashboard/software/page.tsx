export const dynamic = 'force-dynamic';

import SoftwareClient from './SoftwareClient';

export const metadata = {
    title: 'Portal de Arquitectura, Software & IA | ATOMIC ERP',
    description: 'Consola de Infraestructura, Modelos de IA NVIDIA y Meta Cloud API para ATOMIC'
};

export default function SoftwarePage() {
    return <SoftwareClient />;
}
