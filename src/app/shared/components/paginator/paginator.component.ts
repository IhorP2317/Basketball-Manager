import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() length: number = 50;
  @Input() pageSize: number = 1;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [1, 3, 5, 10];

  @Input() hidePageSize: boolean = true;
  @Input() showPageSizeOptions: boolean = true;
  @Input() showFirstLastButtons: boolean = true;
  @Input() disabled: boolean = false;
  @Input()isDarkBackground: boolean = true;

  @Output() pageChangedEvent: EventEmitter<PagedListConfiguration> =
    new EventEmitter<PagedListConfiguration>();


  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.pageChangedEvent.emit({
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
    });
  }
}
