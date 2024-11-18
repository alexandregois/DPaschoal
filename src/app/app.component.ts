import { Component, ViewChild } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { RouteTitleService } from '@core/services/route-title.service';
import { DrawerService } from '@core/services/drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { PageTemplate, PageTemplates } from '@models/page-template.interface';
import { AnalyticsService } from '@shared/services/analytics.service';
import { SessionService } from '@core/services/session.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { BuscaProdutoService } from '@core/services/busca-produto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public pageTemplates = PageTemplates;
  public template: PageTemplate | undefined;

  title: string | undefined;
  subtitle: string | undefined;
  @ViewChild('drawer', { static: false }) public drawerElem!: MatDrawer;
  public showBuscaProduto = false;

  constructor(
    private routeTitle: RouteTitleService,
    private router: Router,
    private session: SessionService,
    private drawer: DrawerService,
    private analytics: AnalyticsService,
    private snackBarColorService: SnackBarColorService,
    private buscaProdutoService: BuscaProdutoService
  ) {
    this.analytics.trackCustomerSession(this.session.isAuth);

    this.routeTitle.get().subscribe((title) => {
      this.title = title;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        let data = event.snapshot.data;
        this.subtitle = data['subtitle'];
        this.template = data['template'] || PageTemplates.DEFAULT;
      }
    });

    this.drawer.openState.subscribe((isOpen) => {
      if (isOpen) {
        this.drawerElem.open();
      }
      if (!isOpen) {
        this.drawerElem.close();
      }
    });
    //   this.buscaProdutoService.productLoaded$.subscribe(loaded => {
    //   this.showBuscaProduto = loaded;
    //   console.log("aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii value:", this.showBuscaProduto);
    // });
  }

  onProdutosCarregados(hasData: boolean) {
    this.showBuscaProduto = hasData;
  }

  snackbarClass: string | undefined;
}
