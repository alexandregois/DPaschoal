import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentVisibilityService {
  state = new BehaviorSubject<DocumentVisibilityState>('visible');

  constructor() {
    document.addEventListener('visibilitychange', () => {
      this.state.next(document.visibilityState);
    });
  }
}
