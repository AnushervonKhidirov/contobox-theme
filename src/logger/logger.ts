export class Logger {
  static log(text: string, includeTime: boolean = false) {
    const newText = includeTime ? Logger.withDate(text, text.length) : text;
    process.stdout.write(newText + '\n');
  }

  static success(text: string, additionalText: string, includeTime: boolean = false) {
    const fullText = `\x1b[32m${text}\x1b[0m ${additionalText}`;

    const newText = includeTime
      ? Logger.withDate(fullText, text.length + additionalText.length, true)
      : fullText;

    process.stdout.write(newText + '\n');
  }

  static warn(text: string, additionalText: string, includeTime: boolean = false) {
    const fullText = `\x1b[33m${text}\x1b[0m ${additionalText}`;

    const newText = includeTime
      ? Logger.withDate(fullText, text.length + additionalText.length, true)
      : fullText;

    process.stdout.write(newText + '\n');
  }

  static error(text: string, additionalText: string, includeTime: boolean = false) {
    const fullText = `\x1b[31m${text}\x1b[0m ${additionalText}`;

    const newText = includeTime
      ? Logger.withDate(fullText, text.length + additionalText.length, true)
      : fullText;

    process.stdout.write(newText + '\n');
  }

  static done(text: string, additionalText: string, includeTime: boolean = false) {
    const fullText = `\x1b[36m${text}\x1b[0m ${additionalText}`;

    const newText = includeTime
      ? Logger.withDate(fullText, text.length + additionalText.length, true)
      : fullText;

    process.stdout.write(newText + '\n');
  }

  private static withDate(text: string, textLength: number, isColoredText = false) {
    const terminalWidth = process.stdout.columns;
    const time = new Date().toLocaleTimeString();
    const spacesLength = isColoredText ? 3 : 2;
    const fullLength = terminalWidth - time.length - textLength - spacesLength;

    const dashes = new Array(fullLength).fill('-').join('');

    return `${text} ${dashes} ${time}`;
  }

  static clear() {
    console.clear();
  }
}
