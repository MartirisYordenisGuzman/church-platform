import { Church, Ministry, Song, Event, Sermon } from "@prisma/client"

export type ChurchProfile = Church & {
    events?: Event[]
    sermons?: Sermon[]
    ministries?: Ministry[]
    songs?: Song[]
}
