export const metadata = {
  title: "ATOMIC // Cerebro Neuronal 3D (SOFT3 Core)",
  description: "Visualizador tridimensional interactivo de nodos de conocimiento y módulos SOFT3 en WebGL."
}

export default function Brain3DPage() {
  return (
    <div className="w-screen h-screen bg-[#030712] overflow-hidden">
      <iframe
        src="/brain.html"
        className="w-full h-full border-none"
        title="Cerebro Neuronal 3D ATOMIC"
      />
    </div>
  )
}
