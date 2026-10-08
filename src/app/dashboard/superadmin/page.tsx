export const dynamic = 'force-dynamic';

import SuperAdminClient from './SuperAdminClient';

export const metadata = {
    title: 'Super Admin · Control Maestro & Esquema de Permisos | ATOMIC ERP',
    description: 'Consola Central Super Admin con Organigrama Dinámico y Matriz Integral de Permisos ATOMIC'
};

export default function SuperAdminPage() {
    return <SuperAdminClient />;
}
