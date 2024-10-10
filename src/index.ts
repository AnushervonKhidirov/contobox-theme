import type { TStylesFrom, TContoboxType } from './types'

import path from 'path'
import { input, select } from '@inquirer/prompts'

import { watchFiles } from './utils/watch-files'
import { generateStyles } from './utils/generate-styles'

export const saveEndpoint = 'https://flow-dbb1.contobox.com/themesv30/saveStyle.html'
export const loadEndpoint = 'https://flow-dbb1.contobox.com/themesv30/loadStyle.html'

async function start() {
    const getStylesFromList: TStylesFrom[] = ['theme', 'local']
    const availableContoboxList: TContoboxType[] = ['desktop', 'mobile', 'fallback', 'banner']

    const getStylesFrom = (await select({ message: `Get style from:`, choices: getStylesFromList})) as TStylesFrom
    const contoboxType = (await select({ message: `Contobox typ:`, choices: availableContoboxList})) as TContoboxType
    
    const themeId = await input({ message: 'Theme id:' })
    const themeName = await input({ message: 'Theme name:' })
    const convertedThemeName = themeName.replaceAll(' ', '_').toLowerCase()
    const cookie = await input({ message: 'Cookies:' })

    const templateDirname = path.resolve(__dirname, 'style-templates')
    const buildDirname = './styles'

    console.clear()
    await generateStyles(buildDirname, templateDirname, contoboxType, getStylesFrom, convertedThemeName, themeName, cookie, themeId)
    watchFiles(buildDirname, cookie, convertedThemeName, themeName, themeId, getStylesFrom, contoboxType)
}

start()
