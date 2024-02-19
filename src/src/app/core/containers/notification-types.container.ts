import {Injectable} from '@angular/core';
import {NotificationType} from '../models/notification-type';

@Injectable()
export class NotificationTypesContainer {
  private types: NotificationType[];

  public setTypes(types: NotificationType[]): void {
    this.types = types;
  }

  public getTypes(): NotificationType[] {
    return this.types;
  }

  public getType(id: number): NotificationType {
    return this.types.filter(type => type.id === id)[0];
  }
}
