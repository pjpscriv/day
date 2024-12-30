export type TimeDisplay = {
    time: Date,
    dotPosition: string,
    rotation: number,
    label: {
        viewBox: string,
        path: string,
        pathRotate: string,
        pathTransform: string,
        isAbove: boolean
    }
}