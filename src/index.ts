import type { TStylesFrom, TContoboxType } from './types'

import path from 'path'
import { input, select } from '@inquirer/prompts'

import { watchFiles } from './utils/watch-files'
import { generateStyles } from './utils/generate-styles'

export const saveEndpoint = 'https://flow-dbb1.contobox.com/themesv30/saveStyle.html'
export const loadEndpoint = 'https://flow-dbb1.contobox.com/themesv30/loadStyle.html'

async function main() {
    const getStylesFromList: TStylesFrom[] = ['theme', 'local', 'generate styles only']
    const availableContoboxList: TContoboxType[] = ['desktop', 'mobile', 'fallback', 'banner']

    const getStylesFrom = await select<TStylesFrom>({ message: `Get style from:`, choices: getStylesFromList})
    const contoboxType = await select<TContoboxType>({ message: `Contobox type:`, choices: availableContoboxList})
    
    const io = await input({ message: 'Contobox IO:' })
    const themeId = await input({ message: 'Theme id:' })
    const themeName = await input({ message: 'Theme name:' })
    const convertedThemeName = themeName.replaceAll(' ', '_').toLowerCase()
    const generateStylesOnly = getStylesFrom === 'generate styles only'
    const token = generateStylesOnly ? '' : await input({ message: 'token (PHPSESSID):' })

    const templateDirname = path.resolve(__dirname, 'style-templates')
    const buildDirname = `./contoboxes/IO ${io} - ${themeName}/styles`

    console.clear()
    
    await generateStyles(buildDirname, templateDirname, contoboxType, getStylesFrom, convertedThemeName, themeName, token, themeId)

    if (generateStylesOnly) {
        console.log('Styles generated');
        process.exit()
    }

    watchFiles(buildDirname, token, convertedThemeName, themeName, themeId, getStylesFrom, contoboxType)
}

main()
