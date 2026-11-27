import AnyDeskRemoteView from "@/components/tools/AnyDeskRemoteView"

export const dynamic = "force-dynamic"

export default function AnyDeskPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white rounded-3xl border border-slate-800/80 p-3 sm:p-6">
      <AnyDeskRemoteView />
    </div>
  )
}
