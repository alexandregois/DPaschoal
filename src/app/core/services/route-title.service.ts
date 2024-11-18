import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteTitleService {
  private _title$ = new BehaviorSubject<string | undefined>('');

  constructor() {}

  public get(): Observable<string | undefined> {
    return this._title$.asObservable();
  }

  public set(title: string | undefined): void {
    this._title$.next(title);
  }
}
