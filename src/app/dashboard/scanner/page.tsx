export const dynamic = 'force-dynamic';

import ScannerClient from './ScannerClient';

export const metadata = {
    title: 'Escáner de Códigos de Barras | ATOMIC ERP',
    description: 'Módulo de escaneo óptico e indexación de inventario con cámara móvil para ATOMIC'
};

export default function ScannerPage() {
    return <ScannerClient />;
}
