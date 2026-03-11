import { churchService } from "@/services/churchService"
import { notFound } from "next/navigation"
import PortalRenderer from "@/components/portal/PortalRenderer"

export default async function ChurchHomePage({
    params,
}: {
    params: Promise<{ churchSlug: string }>
}) {
    const { churchSlug } = await params
    const church = await churchService.getChurchFullProfileBySlug(churchSlug)

    if (!church) {
        notFound()
    }

    return (
        <div className="flex-1 w-full bg-slate-50">
            <PortalRenderer church={church} />
        </div>
    )
}
