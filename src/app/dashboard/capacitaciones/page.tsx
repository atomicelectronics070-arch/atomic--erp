import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function DashboardCapacitacionesPage() {
  redirect('/web/area-ventas')
}
