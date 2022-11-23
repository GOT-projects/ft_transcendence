export enum gameStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    FINISH = 'FINISH'
}

export interface Rank {
    id: number;
    val: number;
    lose: number;
}
