export class StringUtils {
  public static clearPolishCharacters(text: string): string {
    const find = ['ą', 'ę', 'ć', 'ż', 'ź', 'ó', 'ł', 'ń', 'ś', 'Ą', 'Ę', 'Ć', 'Ż', 'Ź', 'Ó', 'Ł', 'Ń', 'Ś'];
    const replace = ['a', 'e', 'c', 'z', 'z', 'o', 'l', 'n', 's', 'A', 'E', 'C', 'Z', 'Z', 'O', 'L', 'N', 'S'];
    for (let i = 0; i < find.length; i++) {
      text = text.replace(find[i], replace[i]);
    }
    return text;
  }

  public static stringIncludes(a: string, b: string): boolean {
    return StringUtils.clearPolishCharacters(a).toLowerCase()
      .includes(StringUtils.clearPolishCharacters(b).toLowerCase());
  }

  public static compareString(a: string, b: string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  public static toCamelCase(value: string): string {
    const joined = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    return joined.charAt(0).toLowerCase() + joined.slice(1);
  }
}
