import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  openState: Subject<boolean> = new Subject();

  constructor() {}

  open(): void {
    this.openState.next(true);
  }

  close(): void {
    this.openState.next(false);
  }
}
