export interface Mark {
    movieFor: number
    userFrom: number
    assignedAt: Date
    updatedAt: Date
    value: number
}

export interface MarkModify {
    marksScore: number
    marksAmount: number
    mark: Mark
}
