import {Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {HttpClient} from '@angular/common/http';
import {settingsRoutes} from '../../../config/routes.config';

@Injectable()
export class PushNotificationService {

  private swPush: SwPush;
  private publicKey: string;
  private httpClient: HttpClient;

  public constructor(swPush: SwPush, httpClient: HttpClient) {
    this.swPush = swPush;
    this.httpClient = httpClient;
  }

  public setPublicKey(publicKey: string): void {
    this.publicKey = publicKey;
  }

  public subscribe() {
    this.swPush.requestSubscription({serverPublicKey: this.publicKey})
      .then(subscription => this.sendRequest(subscription))
      .catch(() => null);
  }

  private sendRequest(pushSubscription: PushSubscriptionJSON): void {
    this.httpClient.post(settingsRoutes.subscription, pushSubscription).subscribe();
  }
}
