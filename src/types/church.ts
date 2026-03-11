import { Church, Ministry, Song, Event, Sermon, PortalConfig, PortalBlock } from "@prisma/client"

export type ChurchProfile = Church & {
    events?: Event[]
    sermons?: Sermon[]
    ministries?: Ministry[]
    songs?: Song[]
    portalConfig?: (PortalConfig & { blocks: PortalBlock[] }) | null
}
