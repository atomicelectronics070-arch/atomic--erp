import { Metadata } from 'next';
import ClientConfirm from './ClientConfirm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Confirmación de Pago | Atomic E-Commerce',
    description: 'Comprobante oficial de compra y confirmación de pago en línea de Atomic Electronics.',
};

export default function CheckoutConfirmPage() {
    return <ClientConfirm />;
}
