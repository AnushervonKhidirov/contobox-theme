import type { TStylesFrom, TContoboxType } from '../types'

import path from 'path'
import fs from 'fs'

import { getBodyForPull } from './get-body'
import { getHeaders } from './get-headers'
import { pullTheme } from './pull-theme'

export async function generateStyles(
    buildDirname: string,
    templateDirname: string,
    contoboxType: TContoboxType,
    getStylesFrom: TStylesFrom,
    convertedThemeName: string,
    themeName: string,
    token: string,
    themeId: string,
) {
    createFolders(buildDirname)

    if (getStylesFrom === 'local') generateStylesFromLocal(buildDirname, templateDirname, contoboxType)
    if (getStylesFrom === 'theme') await generateStylesFromTheme(buildDirname, contoboxType, convertedThemeName, themeName, token, themeId)
}

function createFolders(dirname: string) {
    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
    if (!fs.existsSync(path.resolve(dirname, 'images'))) fs.mkdirSync(path.resolve(dirname, 'images'), { recursive: true })
}

function generateStylesFromLocal(buildDirname: string, templateDirname: string, contoboxType: TContoboxType) {
    const selectedContoboxTypeStylesList: { [key: string]: string[] } = {
        desktop: ['styles-exp.css', 'desktop.css'],
        mobile: ['styles-exp.css', 'mobile.css'],
        fallback: [
            'styles-fallback.css',
            '160x600-fallback.css',
            '300x250-fallback.css',
            '300x600-fallback.css',
            '728x90-fallback.css',
            '970x250-fallback.css',
        ],
        banner: [
            'styles-banner.css',
            '160x600-banner.css',
            '300x250-banner.css',
            '300x600-banner.css',
            '728x90-banner.css',
            '970x250-banner.css',
        ],
    }

    const filesListWithContent: { [key: string]: string } = {
        '160x600-banner.css': path.resolve(templateDirname, '160x600.css'),
        '160x600-fallback.css': path.resolve(templateDirname, '160x600.css'),
        '300x250-banner.css': path.resolve(templateDirname, '300x250.css'),
        '300x250-fallback.css': path.resolve(templateDirname, '300x250.css'),
        '300x600-banner.css': path.resolve(templateDirname, '300x600.css'),
        '300x600-fallback.css': path.resolve(templateDirname, '300x600.css'),
        '728x90-banner.css': path.resolve(templateDirname, '728x90.css'),
        '728x90-fallback.css': path.resolve(templateDirname, '728x90.css'),
        '970x250-banner.css': path.resolve(templateDirname, '970x250.css'),
        '970x250-fallback.css': path.resolve(templateDirname, '970x250.css'),
        'desktop.css': path.resolve(templateDirname, 'desktop.css'),
        'mobile.css': path.resolve(templateDirname, 'mobile.css'),
        'styles-banner.css': path.resolve(templateDirname, 'styles-banner.css'),
        'styles-exp.css': path.resolve(templateDirname, 'styles-exp.css'),
        'styles-fallback.css': path.resolve(templateDirname, 'styles-banner.css'),
    }

    selectedContoboxTypeStylesList[contoboxType].forEach(fileName => {
        fs.writeFileSync(path.resolve(buildDirname, fileName), fs.readFileSync(filesListWithContent[fileName], { encoding: 'utf-8' }), {
            encoding: 'utf-8',
        })
    })
}

async function generateStylesFromTheme(
    buildDirname: string,
    contoboxType: TContoboxType,
    convertedThemeName: string,
    themeName: string,
    token: string,
    themeId: string,
) {
    const selectedContoboxTypeStylesList: { [key: string]: string[] } = {
        desktop: ['styles.css', 'lyt-desktop.css'],
        mobile: ['styles.css', 'lyt-mobile.css'],
        fallback: [
            'styles-fallback.css',
            'fmt-300x600-fallback.css',
            'fmt-300x250-fallback.css',
            'fmt-160x600-fallback.css',
            'fmt-970x250-fallback.css',
            'fmt-728x90-fallback.css',
        ],
        banner: ['styles.css', 'fmt-300x600.css', 'fmt-300x250.css', 'fmt-160x600.css', 'fmt-970x250.css', 'fmt-728x90.css'],
    }

    const convertedFileNames: { [key: string]: { [key: string]: string } } = {
        desktop: {
            'styles.css': 'styles-exp.css',
            'lyt-desktop.css': 'desktop.css',
        },
        mobile: {
            'styles.css': 'styles-exp.css',
            'lyt-mobile.css': 'mobile.css',
        },
        fallback: {
            'styles-fallback.css': 'styles-fallback.css',
            'fmt-300x600-fallback.css': '300x600-fallback.css',
            'fmt-300x250-fallback.css': '300x250-fallback.css',
            'fmt-160x600-fallback.css': '160x600-fallback.css',
            'fmt-970x250-fallback.css': '970x250-fallback.css',
            'fmt-728x90-fallback.css': '728x90-fallback.css',
        },
        banner: {
            'styles.css': 'styles-banner.css',
            'fmt-300x600.css': '300x600-banner.css',
            'fmt-300x250.css': '300x250-banner.css',
            'fmt-160x600.css': '160x600-banner.css',
            'fmt-970x250.css': '970x250-banner.css',
            'fmt-728x90.css': '728x90-banner.css',
        },
    }

    async function pullThemeAsync(fileIndex: number = 0) {
        const fileLength = selectedContoboxTypeStylesList[contoboxType].length

        const fileName = selectedContoboxTypeStylesList[contoboxType][fileIndex]
        const headers = getHeaders(token, themeId)
        const body = getBodyForPull(convertedThemeName, fileName, contoboxType)
        const styles = await pullTheme(headers, body, fileName, themeName)

        
        const convertedFileName = convertedFileNames[contoboxType][fileName]
        fs.writeFileSync(path.resolve(buildDirname, convertedFileName), styles, { encoding: 'utf-8' })

        if (fileIndex < fileLength - 1) await pullThemeAsync(++fileIndex)
    }

    await pullThemeAsync()
}
