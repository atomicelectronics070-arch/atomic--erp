import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function DashboardAreaVentasPage() {
  redirect('/web/area-ventas')
}
