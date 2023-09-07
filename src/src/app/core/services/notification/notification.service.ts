import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class NotificationService {
  private translateService: TranslateService;
  private router: Router;
  private toastrService: ToastrService;

  constructor(translateService: TranslateService, router: Router, toastrService: ToastrService) {
    this.translateService = translateService;
    this.router = router;
    this.toastrService = toastrService;
  }

  public showMessage(key: string): void {
    this.showSnackBar('success', key);
  }

  public showErrorMessage(key: string): void {
    this.showSnackBar('error', key);
  }

  public showWarningMessage(key: string): void {
    this.showSnackBar('warning', key);
  }

  public showError(error: number): void {
    if (error === 401) {
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
      this.showSnackBar('error', 'messages.authError');
    } else if (error === 404 || error === 422 || error === 400) {
      this.showSnackBar('error', 'messages.invalidDataError');
    } else if (error === 500) {
      this.showSnackBar('error', 'messages.serverError');
    } else {
      this.showSnackBar('error', 'messages.unknownError');
    }
  }

  public showNotification(name: string, content: string | null): void {
    const audio = new Audio();
    audio.src = 'assets/alert.wav';
    audio.load();
    audio.play();
    this.toastrService.info(content, name, {
      enableHtml: true,
      positionClass: 'toast-top-full-width',
      disableTimeOut: true
    });
  }

  private showSnackBar(type: string, key: string): void {
    if (type === 'success') {
      this.translateService.get(key).subscribe(message => this.toastrService.success(message, null, {
        progressBar: true,
        progressAnimation: 'decreasing'
      }));
    }

    if (type === 'error') {
      this.translateService.get(key).subscribe(message => this.toastrService.error(message, null, {
        progressBar: true,
        progressAnimation: 'decreasing'
      }));
    }

    if (type === 'warning') {
      this.translateService.get(key).subscribe(message => this.toastrService.warning(message, null, {
        progressBar: true,
        progressAnimation: 'decreasing'
      }));
    }
  }
}
