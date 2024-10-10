import { saveEndpoint } from '../index'
import { showLogs } from './log'

export async function saveTheme(headers: { [key: string]: string }, body: string, file: string, themeName: string) {
    const options = {
        method: 'POST',
        body: body,
        headers: headers,
    }

    await fetch(saveEndpoint, options)

    showLogs(file, 'push', themeName)
}
