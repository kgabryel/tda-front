import {Color} from '@angular-material-components/color-picker';

export abstract class ColorUtils {
  public static hexToColor(hex: string): Color {
    let alpha;
    if (hex.length === 9) {
      alpha = parseInt(hex.slice(7, 9), 16);
    } else {
      alpha = null;
    }
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);
    return new Color(red, green, blue, alpha);
  }
}
