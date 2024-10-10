import { unescape } from 'querystring'
import { loadEndpoint } from '../index'
import { showLogs } from './log'

export async function pullTheme(headers: { [key: string]: string }, body: string, file: string) {
    const options = {
        method: 'POST',
        body: body,
        headers: headers,
    }

    const response = await fetch(loadEndpoint, options)
    const styles = await response.json()

    showLogs(file, 'pulled')
    return unescape(styles.media)
}
