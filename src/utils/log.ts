export function showLogs(fileName: string, event: 'push' | 'pull', themeName: string) {
    const fileNameLength = fileName.length
    
    const additionalText = event === 'pull' ? `pull from ${themeName}` : `push to ${themeName}`
    const timeText = `${additionalText} at ${new Date().toLocaleTimeString()}`
    const cmdLineWidth = process.stdout.columns - timeText.length - 1

    const fileNameSpace = Array.from({ length: cmdLineWidth }, (_, i) => {
        return fileNameLength > i ? fileName[i] : fileNameLength === i ? ' ' : '-'
    })

    console.log(`${fileNameSpace.join('')} ${timeText}`)
}