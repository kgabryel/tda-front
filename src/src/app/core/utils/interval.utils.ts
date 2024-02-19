import {intervalNotificationTypes} from '../../config/interval-types.config';

export abstract class IntervalUtils {
  public static mapToBehaviour(value: string): string {
    return intervalNotificationTypes.find(intervalType => intervalType.value === value).name;
  }

  public static showWithInterval(behaviour: string): boolean {
    const withInterval = ['day', 'week', 'month'];
    return withInterval.includes(behaviour);
  }
}
