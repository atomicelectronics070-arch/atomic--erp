export const dynamic = 'force-dynamic'
export const revalidate = 0

import PageClient from "./PageClient"

export default function DynamicDashboardPage({ params }: { params: Promise<{ courseId: string }> }) {
    return <PageClient params={params} />
}
