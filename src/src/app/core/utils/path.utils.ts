export abstract class PathUtils {
  public static concatPath(...parts: string[]): string {
    return '/' + parts.join('/');
  }

  public static bindParams(path: string, params: Map<string, string>): string {
    params.forEach((value: string, key: string) => path = path.replace(`:${key}`, value));
    return path;
  }
}
