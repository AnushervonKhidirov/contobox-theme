export function showLogs(fileName: string, event: 'pushed' | 'pulled') {
    const fileNameLength = fileName.length
    const pushedAtText = `${event} at ${new Date().toLocaleTimeString()}`
    const cmdLineWidth = process.stdout.columns - pushedAtText.length - 1

    const fileNameSpace = Array.from({ length: cmdLineWidth }, (_, i) => {
        return fileNameLength > i ? fileName[i] : fileNameLength === i ? ' ' : '-'
    })

    console.log(`${fileNameSpace.join('')} ${pushedAtText}`)
}