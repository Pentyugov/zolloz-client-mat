// import { Injectable, OnDestroy } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { Subject } from 'rxjs';
// import {MatPaginatorIntl} from "@angular/material/paginator";
// import { map, tap, takeUntil} from 'rxjs/operators';
//
// @Injectable()
// export class ZollozMatPaginatorIntl extends MatPaginatorIntl
//   implements OnDestroy {
//   unsubscribe: Subject<void> = new Subject<void>();
//   OF_LABEL = 'of';
//
//   constructor(private translate: TranslateService) {
//     super();
//
//     this.translate.onLangChange
//       .takeUntil(this.unsubscribe)
//       .subscribe(() => {
//         this.getAndInitTranslations();
//       });
//
//     this.getAndInitTranslations();
//   }
//
//   ngOnDestroy() {
//     this.unsubscribe.next();
//     this.unsubscribe.complete();
//   }
//
//   getAndInitTranslations() {
//     this.translate
//       .get([
//         'PAGINATOR.ITEMS_PER_PAGE',
//         'PAGINATOR.NEXT_PAGE',
//         'PAGINATOR.PREVIOUS_PAGE',
//         'PAGINATOR.OF_LABEL',
//       ])
//       .takeUntil(this.unsubscribe)
//       .subscribe(translation => {
//         this.itemsPerPageLabel =
//           translation['PAGINATOR.ITEMS_PER_PAGE'];
//         this.nextPageLabel = translation['PAGINATOR.NEXT_PAGE'];
//         this.previousPageLabel =
//           translation['PAGINATOR.PREVIOUS_PAGE'];
//         this.OF_LABEL = translation['PAGINATOR.OF_LABEL'];
//         this.changes.next();
//       });
//   }
//
//   getRangeLabel = (
//     page: number,
//     pageSize: number,
//     length: number,
//   ) => {
//     if (length === 0 || pageSize === 0) {
//       return `0 ${this.OF_LABEL} ${length}`;
//     }
//     length = Math.max(length, 0);
//     const startIndex = page * pageSize;
//     const endIndex =
//       startIndex < length
//         ? Math.min(startIndex + pageSize, length)
//         : startIndex + pageSize;
//     return `${startIndex + 1} - ${endIndex} ${
//       this.OF_LABEL
//     } ${length}`;
//   };
// }
