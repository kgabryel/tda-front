import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {environment} from '../../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {ImagesConfig} from '../../../../config/images.config';
import {LangService} from '../../../../core/services/lang/lang.service';

@Component({
  selector: 'shared-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss'],
  animations: [
    trigger('tasks-slide', [
      state('pl', style({left: '0px'})),
      state('en', style({
        left: '-42px'
      })),
      transition('pl <=> en', animate('0.3s'))
    ])
  ]
})
export class LangComponent implements OnInit {

  public state: string;
  public plFlagPath: string;
  public engFlagPath: string;
  private translateService: TranslateService;
  private langService: LangService;

  public constructor(translateService: TranslateService, langService: LangService) {
    this.plFlagPath = ImagesConfig.plFlagPath;
    this.engFlagPath = ImagesConfig.engFlagPath;
    this.translateService = translateService;
    this.langService = langService;
  }

  public ngOnInit(): void {
    let lang = localStorage.getItem('lang');
    if (lang !== 'pl' && lang !== 'en') {
      lang = environment.lang;
    }
    this.state = lang;
    this.translateService.use(this.state);
  }

  public changeLang(newLang: string): void {
    if (newLang !== 'pl' && newLang !== 'en') {
      return;
    }
    this.state = newLang;
    this.langService.changeLang(newLang);
    localStorage.setItem('lang', newLang);
    this.translateService.use(newLang);
  }
}
