import { Injectable, Type } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Params,
  Resolve,
  ResolveFn,
  Router,
  TitleStrategy,
} from '@angular/router';
import { environment } from '@env';
import { StoreService } from '@shared/services/store.service';
import { Customer } from '../enum/auth.enum';

@Injectable({
  providedIn: 'root',
})
export class BeOnService {
  constructor(
    private title: TitleStrategy,
    private router: Router,
    private store: StoreService
  ) {
    this.init();
  }

  init(): void {
    if (window.beon) {
      window.beon('create', environment.beOn, 'propria');
    }
  }

  searchInit(): void {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');

    script.async = true;
    script.id = 'bn-search-loader';
    script.src = 'https://c.usebeon.io/search-page/loaderv2.js';
    script.dataset['bnTenantId'] = environment.beOn;
    head.appendChild(script);
    script.addEventListener('load', () => {
      if (window.loadSearchInputComponent) {
        window.loadSearchInputComponent('#beon-search');
      }
    });
  }

  trackPageView(
    pageTitle: string | Type<Resolve<string>> | ResolveFn<string> | undefined
  ) {
    const page = pageTitle === '' ? 'homepage' : 'other';
    console.info('beOn.trackPageView', page);
    if (window.beon) {
      console.info(`beon('track', 'pageview', '${page}')`);
      window.beon('track', 'pageview', page);
    }
  }

  trackProductView(productId: string) {
    const payload = {
      sku: productId,
      pathname: `/produtos/${productId}`,
    };
    console.info('beOn.trackProductView', payload);
    if (window.beon) {
      console.info(
        `beon('track', 'pageview', 'product', '${JSON.stringify(payload)}')`
      );
      window.beon('track', 'pageview', 'product', payload);
    }
  }

  trackProductListView(anchors: { [key: string]: string } | undefined) {
    if (anchors && Object.keys(anchors).length) {
      const trees = Object.entries(anchors).map((anchor) => ({
        tree_id: anchor[1],
        kind: anchor[0],
      }));
      const payload = { trees };
      console.info('beOn.trackProductListView', payload);
      if (window.beon) {
        console.info(
          `beon('track', 'pageview', 'catalog', '${JSON.stringify(payload)}')`
        );
        window.beon('track', 'pageview', 'catalog', payload);
      }
    }
  }

  trackSearchListView(categoriaId: string) {
    const payload = [
      {
        tree_id: categoriaId,
        kind: 'department',
      },
    ];
    console.info('beOn.trackSearchListView', payload);
    if (window.beon) {
      console.info(
        `beon('track', 'pageview', 'search', '${JSON.stringify(payload)}')`
      );
      window.beon('track', 'pageview', 'search', payload);
    }
  }

  // TODO: TRACK USER SESSION
  trackCustomerSession(isAuth: boolean) {
    // this.session.isAuth
    const id = this.store.getSelected('cnpj').getValue();
    const payload = {
      id: isAuth ? id : null,
      groups: ['vip', 'tabela C'],
      is_logged_in: isAuth,
    };
    console.info('beOn.trackCustomerSession', payload);
    localStorage.setItem(Customer.CUSTOMER_PORTAL, environment.portal);
    if (window.beon) {
      console.info(
        `beon('track', 'customer', 'cart', '${JSON.stringify(payload)}')`
      );
      window.beon('track', 'customer', 'update', payload);
    }
  }

  // TODO: TROCAR ANY POR TIPO CORRETO
  trackShoppingCartView(payload: any) {
    console.info('beOn.trackShoppingCartView', payload);
    if (window.beon) {
      console.info(
        `beon('track', 'pageview', 'cart', '${JSON.stringify(payload)}')`
      );
      window.beon('track', 'pageview', 'cart', payload);
    }
  }

  trackPurchaseView(payload: any) {
    console.info('beOn.trackPurchaseView', payload);
    if (window.beon) {
      console.info(
        `beon('track', 'pageview', 'transaction', '${JSON.stringify(payload)}')`
      );
      window.beon('track', 'pageview', 'transaction', payload);
    }
  }

  trackNotFoundView(payload: any) {
    console.info('beOn.trackNotFoundView', payload);
    if (window.beon) {
      console.info(
        `beon('track', 'pageview', 'notfound', '${JSON.stringify({
          intended: payload,
        })}')`
      );
      window.beon('track', 'pageview', 'notfound', { intended: payload });
    }
  }

  prepareParams(data: { params?: Params; queryParams?: Params }) {
    let response: { [key: string]: string } = {};
    if (data.params && data.params['categoria']) {
      response['department'] = data.params['categoria'];
    }
    if (data.queryParams) {
      response = { ...response, ...data.queryParams };
    }
    return response;
  }

  reset(snapshot: ActivatedRouteSnapshot | undefined): void {
    if (snapshot) {
      const resolvedTitleForRoute =
        this.title.getResolvedTitleForRoute(snapshot);

      const params = this.prepareParams({
        params: snapshot.params,
        queryParams: snapshot.queryParams,
      });
      if (params && Object.keys(params).length) {
        this.loadSearch(params);
      }
    }
  }

  loadSearch(anchors: { [key: string]: string } | undefined) {
    if (
      anchors &&
      Object.entries(anchors).length &&
      window.loadSearchComponentCustom
    ) {
      if (anchors['pesquisa'] && this.router.url.startsWith('/busca')) {
        console.info(
          'BeOn.loadSearch',
          `window.loadSearchComponentCustom('app-busca')`
        );
        window.loadSearchComponentCustom('app-busca');
      } else if (this.router.url.startsWith('/categorias')) {
        const response = Object.entries(anchors).map(
          (anchor) => `${anchor[0]}:${anchor[1]}`
        );

        console.info(
          'BeOn.loadSearch',
          `window.loadSearchComponentCustom('app-categorias', ${JSON.stringify(
            response
          )}, '')`
        );

        window.loadSearchComponentCustom('app-categorias', response, '');
      }
    } else if (window.loadSearchComponent) {
      window.loadSearchComponent();
    }
  }
}
