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

      process.stdout.write(textWithDate);
    } else {
      process.stdout.write(text);
    }
  }

  static success(text: string, additionalText: string) {
    process.stdout.write(`\x1b[32m${text}\x1b[0m ${additionalText}\n`);
  }

  static warn(text: string, additionalText: string) {
    process.stdout.write(`\x1b[33m${text}\x1b[0m ${additionalText}\n`);
  }

  static error(text: string, additionalText: string) {
    process.stdout.write(`\x1b[31m${text}\x1b[0m ${additionalText}\n`);
  }

  static done(text: string, additionalText: string) {
    process.stdout.write(`\x1b[36m${text}\x1b[0m ${additionalText}\n`);
  }

  private withDates() {}

  static clear() {
    console.clear();
  }
}
