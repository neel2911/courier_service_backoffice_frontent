import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";

export class ReactiveDatasource implements DataSource<any> {
  private dataSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  connect(
    collectionViewer: CollectionViewer
  ): Observable<any[] | readonly any[]> {
    console.log(this.dataSubject.getValue());
    return this.dataSubject;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData(dataObserver: Observable<any>) {
    this.loadingSubject.next(true);
    dataObserver
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((data) => this.dataSubject.next(data));
  }
}
