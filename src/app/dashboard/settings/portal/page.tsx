import { getPortalConfig } from "./actions"
import PortalSettingsClient from "./PortalSettingsClient"

export default async function PortalSettingsPage() {
    const config = await getPortalConfig()

    // Transform blocks to plain objects to pass to Client Component safely
    const plainConfig = {
        ...config,
        blocks: config.blocks.map(b => ({
            id: b.id,
            type: b.type,
            order: b.order,
            is_visible: b.is_visible,
            data: b.data ? JSON.parse(JSON.stringify(b.data)) : {}
        })),
        theme: config.theme ? JSON.parse(JSON.stringify(config.theme)) : {}
    }

    return (
        <PortalSettingsClient initialConfig={plainConfig as any} />
    )
}
