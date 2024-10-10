import type { TContoboxType, TStylesFrom } from '../types'

import path from 'path'
import fs from 'fs'

import { saveTheme } from './save-theme'
import { getHeaders } from './get-headers'
import { getBodyForPush } from './get-body'

export async function watchFiles(
    dirname: string,
    cookie: string,
    themeName: string,
    themeId: string,
    getStylesFrom: TStylesFrom,
    contoboxType: TContoboxType,
) {
    const cssFiles = fs.readdirSync(dirname)

    cssFiles.forEach(file => {
        if (getStylesFrom === 'local') pushTheme(file)

        fs.watch(path.resolve(dirname, file), () => {
            pushTheme(file)
        })
    })

    function pushTheme(file: string) {
        const styles = fs.readFileSync(path.resolve(dirname, file), { encoding: 'utf-8' })
        const headers = getHeaders(cookie, themeId)
        const body = getBodyForPush(themeName, themeId, file, styles, contoboxType)
        saveTheme(headers, body, file)
    }
}
