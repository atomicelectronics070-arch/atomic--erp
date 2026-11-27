import SuppliersManager from "@/components/tools/SuppliersManager"

export const dynamic = "force-dynamic"

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white rounded-3xl border border-slate-800/80 p-3 sm:p-6">
      <SuppliersManager />
    </div>
  )
}
