import { unescape } from 'querystring'
import { loadEndpoint } from '../index'
import { showLogs } from './log'

export async function pullTheme(headers: { [key: string]: string }, body: string, file: string, themeName: string) {
    const options = {
        method: 'POST',
        body: body,
        headers: headers,
    }

    try {
        const response = await fetch(loadEndpoint, options)
        const styles = await response.json()

        showLogs(file, 'pull', themeName)
        return unescape(styles.media)
    } catch (err: any) {
        console.log(err.message)
        return ''
    }
}
