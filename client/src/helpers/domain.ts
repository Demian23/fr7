import styles from './domain.module.css'

const getMarkColor = (markOrNot: string, background: boolean = true) => {
    const mark = Number(markOrNot)
    if (!mark) return background ? styles.markNoneB : styles.markNone
    if (background) {
        if (mark <= 20) return styles.markRedB
        if (mark <= 50) return styles.markOrangeB
        if (mark <= 70) return styles.markYellowB
        if (mark <= 85) return styles.markGreenB
        return styles.markBlueB
    } else {
        if (mark <= 20) return styles.markRed
        if (mark <= 50) return styles.markOrange
        if (mark <= 70) return styles.markYellow
        if (mark <= 85) return styles.markGreen
        return styles.markBlue
    }
}

export { getMarkColor }
