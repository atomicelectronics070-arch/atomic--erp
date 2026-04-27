export default function DashboardLoading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white/50 backdrop-blur-sm fixed inset-0 z-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-neutral-100 border-t-orange-600 rounded-none animate-spin"></div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] animate-pulse">Sincronizando Sistema</p>
            </div>
        </div>
    )
}


