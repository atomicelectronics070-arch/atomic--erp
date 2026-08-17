export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Soft3Page() {
  return (
    <div className="w-screen h-screen bg-[#030712] overflow-hidden">
      <iframe
        src="/soft3.html"
        className="w-full h-full border-none"
        title="Cerebro SOFT3 Sistemas Core"
      />
    </div>
  )
}
