import type { TContoboxType, TStyleType } from '../types'

export function getStyleType(contoboxType: TContoboxType): TStyleType {
    const expantions = ['desktop', 'mobile']

    return expantions.includes(contoboxType) ? 'expansion' : 'banner'
}
