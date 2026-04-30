import { redirect } from "next/navigation"

// Legacy route — redirect to main academy admin
export default function OldAcademyAdminPage() {
    redirect("/dashboard/academy")
}
