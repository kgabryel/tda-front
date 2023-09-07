import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {LangService} from '../lang/lang.service';
import {TranslateService} from '@ngx-translate/core';
import {translations} from '../../../config/pagination.config';

@Injectable()
export class PaginationTranslationsService extends MatPaginatorIntl {
  private translateService: TranslateService;
  private of: string;
  private translations;

  constructor(langService: LangService, translateService: TranslateService) {
    super();
    this.translateService = translateService;
    this.of = 'of';
    this.translations = translations;
    langService.getState().subscribe((lang) => this.translate(lang));
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = this.of;
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize;

    const endIndex = Math.min(startIndex + pageSize, length);
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  private translate(lang: string): void {
    this.of = this.translations[lang].of;
    this.firstPageLabel = this.translations[lang].firstPage;
    this.itemsPerPageLabel = this.translations[lang].itemsPerPage;
    this.lastPageLabel = this.translations[lang].lastPage;
    this.nextPageLabel = this.translations[lang].nextPage;
    this.previousPageLabel = this.translations[lang].previousPage;
    this.changes.next();
  }
}
