import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from '@env';
import { RouteTitleService } from './route-title.service';

@Injectable()
export class CustomTitleStrategyService extends TitleStrategy {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private routeTitle: RouteTitleService
  ) {
    super();
  }

  override updateTitle(state: RouterStateSnapshot): void {
    const title = this.buildTitle(state);
    this.routeTitle.set(title);

    if (title) {
      this.document.title = `${title} | ${environment.appTitle}`;
    } else {
      this.document.title = environment.appTitle;
    }
  }
}

export const CustomTitleStrategyServiceProvider = {
  provide: TitleStrategy,
  useClass: CustomTitleStrategyService,
};
