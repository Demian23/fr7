export interface MovieBrief {
    id: number
    title_ru: string
    title_origin: string | null
    genres: string[]
    duration: number
    launch: Date
    marksAmount: number
    marksScore: number
}

// TODO rerun import, directors fix. Add users manually and remove them from import
