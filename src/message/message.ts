export class Message {
  static log(text: string, includeTime: boolean = false) {
    const terminalWidth = process.stdout.columns;
    const textLength = text.length;
    const timeText = includeTime ? new Date().toLocaleTimeString() : null;

    if (timeText) {
      const textWithDashes = Array.from({ length: terminalWidth - timeText.length }, (_, i) => {
        const space = i === textLength || i === terminalWidth - timeText.length - 1 ? ' ' : '-';
        return textLength > i ? text[i] : space;
      });

      const textWithDate = textWithDashes.join('') + timeText;

      console.log(textWithDate);
    } else {
      console.log(text);
    }
  }

  static error(text: string) {
    console.error(text);
  }

  static clear() {
    console.clear();
  }
}
