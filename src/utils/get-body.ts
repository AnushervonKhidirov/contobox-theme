import { escape } from 'querystring'
import type { TContoboxType } from '../types'
import { getStyleType } from './get-style-type'

export function getBodyForPull(themeName: string, fileName: string, contoboxType: TContoboxType) {
    const styleType = getStyleType(contoboxType)

    return `file=cbox_themes_v3%2F${themeName}%2Fstyles%2F${styleType}%2F${fileName}`
}

export function getBodyForPush(themeName: string, themeId: string, fileName: string, styles: string, contoboxType: TContoboxType) {
    const styleType = getStyleType(contoboxType)

    const fileNames: { [key: string]: string } = {
        'styles-exp.css': 'styles.css',
        'desktop.css': 'lyt-desktop.css',
        'mobile.css': 'lyt-mobile.css',

        'styles-banner.css': 'styles.css',
        '300x600-banner.css': 'fmt-300x600.css',
        '300x250-banner.css': 'fmt-300x250.css',
        '160x600-banner.css': 'fmt-160x600.css',
        '970x250-banner.css': 'fmt-970x250.css',
        '728x90-banner.css': 'fmt-728x90.css',

        'styles-fallback.css': 'styles-fallback.css',
        '300x600-fallback.css': 'fmt-300x600-fallback.css',
        '300x250-fallback.css': 'fmt-300x250-fallback.css',
        '160x600-fallback.css': 'fmt-160x600-fallback.css',
        '970x250-fallback.css': 'fmt-970x250-fallback.css',
        '728x90-fallback.css': 'fmt-728x90-fallback.css',
    }

    const styleInner = escape(styles)

    return `file=cbox_themes_v3%2F${themeName}%2Fstyles%2F${styleType}%2F${fileNames[fileName]}&style=${styleInner}&id=${themeId}`
}
