import {Injectable} from '@angular/core';

export interface Result {
  width: string;
  height: string;
}

export interface Sizes {
  minWidth: number;
  minHeight: number;
  singleWidth: number;
  singleHeight: number;
}

@Injectable()
export class ResizerService {

  constructor() {
  }

  private static calculateHeight(windowHeight: number, windowWidth: number): number {
    if (windowWidth < 599) {
      windowHeight -= 112;
    } else {
      windowHeight -= 64;
    }
    return windowHeight - 20;
  }

  public calculateSizes(sizes: Sizes, windowWidth: number, windowHeight: number): Result {
    let result: Result = {
      width: '',
      height: ''
    };
    windowHeight = ResizerService.calculateHeight(windowHeight, windowWidth);
    if (windowHeight <= sizes.minHeight) {
      result.height = sizes.singleHeight + 'px';
    } else {
      let count = Math.ceil(windowHeight / sizes.minHeight);
      let height = windowHeight / count;
      if (height < sizes.minHeight) {
        count -= 1;
      }
      result.height = windowHeight / count + 'px';
    }
    windowWidth -= 20;
    if (windowWidth <= sizes.minWidth) {
      result.width = '100%';
    } else {
      let count = Math.ceil(windowWidth / sizes.minWidth);
      let width = windowWidth / count;
      if (width < sizes.singleWidth) {
        count -= 1;
      }
      result.width = 100 / count + '%';
    }

    return result;
  }
}
