import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {Observable} from 'rxjs';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'header-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchButtonComponent {

  public filtered$: Observable<boolean>;
  private modalService: ModalService;

  public constructor(modalService: ModalService, searchService: SearchService) {
    this.modalService = modalService;
    this.filtered$ = searchService.getState();
  }

  public openModal(): void {
    this.modalService.openModal();
  }
}
