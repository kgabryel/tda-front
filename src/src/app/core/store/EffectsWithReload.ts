import {BaseEffect} from './BaseEffect';
import {Store} from '@ngrx/store';
import {EventsService} from '../services/events/events.service';
import {Actions} from '@ngrx/effects';
import {NotificationService} from '../services/notification/notification.service';

export abstract class EffectsWithReload<Service, State> extends BaseEffect<Service> {
  protected store: Store<State>;
  protected eventsService: EventsService;

  protected constructor(
    store: Store<State>,
    eventsService: EventsService,
    actions: Actions,
    notificationService: NotificationService,
    service: Service
  ) {
    super(actions, notificationService, service);
    this.store = store;
    this.eventsService = eventsService;
    this.watchChanges();
  }

  protected abstract watchChanges(): void;
}
