export const dynamic = 'force-dynamic';

import TecnicosClient from './TecnicosClient';

export const metadata = {
    title: 'Portal de Operaciones Técnicas & Campo | ATOMIC ERP',
    description: 'Plataforma para Técnicos e Instaladores de Seguridad Electrónica ATOMIC'
};

export default function TecnicosPage() {
    return <TecnicosClient />;
}
