import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function BlogsRootPage() {
    redirect("/web/blogs")
}
