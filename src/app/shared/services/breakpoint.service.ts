import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isSmallScreen() {
    return this.breakpointObserver
      .observe(['(max-width: 959px)'])
      .pipe(map((breakpointState) => breakpointState.matches));
  }
}
