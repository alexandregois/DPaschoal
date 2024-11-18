import { Injectable, Type } from '@angular/core';
import { Resolve, ResolveFn } from '@angular/router';
import { GA4Data, GA4Item } from '@models/ga4-events.interface';
import { environment } from '@env';
import { BeOnService } from '@core/services/be-on.service';

// DOCUMENTAÇÃO https://developers.google.com/tag-manager/ecommerce-ga4

// TODO CRIAR ARQUIVO DE INTERFACE CORRETO
// TODO DEFINIR TIPO CORRETAMENTE TODAS AS ENTIDADES (E SUAS CONDICIONAIS)
type EventType =
  | 'viewItemList'
  | 'selectItem'
  | 'viewItem'
  | 'addToCart'
  | 'removeFromCart'
  | 'beginCheckout'
  | 'purchase'
  | 'refund'
  | 'viewPromotion'
  | 'selectPromotion';

type googleEventType =
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'refund'
  | 'view_promotion'
  | 'select_promotion';

enum googleEventTypeEnum {
  viewItemList = 'view_item_list',
  selectItem = 'select_item',
  viewItem = 'view_item',
  addToCart = 'add_to_cart',
  removeFromCart = 'remove_from_cart',
  beginCheckout = 'begin_checkout',
  purchase = 'purchase',
  refund = 'refund',
  viewPromotion = 'view_promotion',
  selectPromotion = 'select_promotion',
}

const item: GA4Item = {
  item_id: '12345',
  item_name: 'Donut Friday Scented T-Shirt',
  index: 1,
  item_brand: 'Google',
  item_category: 'Apparel',
  item_category2: 'Mens',
  item_category3: 'Shirts',
  item_category4: 'Tshirts',
  item_list_id: 'SR123',
  item_list_name: 'Search Results',
  creative_name: 'instore_suummer',
  creative_slot: '1',
  item_variant: 'Black',
  location_id: 'hero_banner',
  price: 15.25,
  promotion_id: 'abc123',
  promotion_name: 'summer_promo',
  quantity: 1,
};

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private beOn: BeOnService) {
    this.initGTM();
    this.initHotjar();
    // this.initUserGuiding();
  }

  initGTM() {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    const layer = 'dataLayer';

    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${environment.gtm}`;

    window[layer] = window[layer] || [];
    window[layer].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    head.appendChild(script);
  }

  initHotjar() {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${environment.hotjar}.js?sv=6`;

    head.appendChild(script);
  }

  initUserGuiding() {
    if (environment.portal === 'DPK') {
      const scriptf = document.getElementsByTagName('script')[0];
      const scriptk = document.createElement('script');
      const guiding: any = 'userGuiding';
      scriptk.type = 'text/javascript';
      scriptk.async = true;
      scriptk.src = `https://static.userguiding.com/media/user-guiding-305854358ID-embedded.js`;
      scriptf.parentNode?.insertBefore(scriptk, scriptf);
      const guidingug = window[guiding];

      if (guidingug) return;
    }
  }

  trackPageView(
    pageTitle: string | Type<Resolve<string>> | ResolveFn<string> | undefined
  ) {
    console.info('analytics.trackPageView', pageTitle);
    this.beOn.trackPageView(pageTitle);
  }

  trackProductView(productId: string) {
    console.info('analytics.trackProductView', productId);
    this.beOn.trackProductView(productId);
    this.shoppingGoogleEvent('view_item', {
      items: [
        {
          item_id: productId,
          item_name: productId,
        },
      ],
    });
  }

  trackSearchListView(categoriaId: string) {
    this.beOn.trackSearchListView(categoriaId);
  }

  trackProductListView(anchors: { [key: string]: string } | undefined) {
    if (anchors && Object.keys(anchors).length) {
      this.beOn.trackProductListView(anchors);
      Object.entries(anchors).forEach((anchor) => {
        this.shoppingGoogleEvent('view_item_list', {
          item_list_name: anchor[1],
          item_list_id: anchor[0],
          items: [],
        });
      });
    }
  }

  // TODO: TRACK USER SESSION
  trackCustomerSession(isAuth: boolean) {
    this.beOn.trackCustomerSession(isAuth);
  }

  // TODO: TROCAR ANY POR TIPO CORRETO
  trackShoppingCartView(payload: any) {
    this.beOn.trackShoppingCartView(payload);
  }

  // TODO: TROCAR ANY POR TIPO CORRETO
  trackPurchaseView(payload: any) {
    this.beOn.trackPurchaseView(payload);
  }

  // TODO: TROCAR ANY POR TIPO CORRETO
  trackNotFoundView(payload: any) {
    this.beOn.trackNotFoundView(payload);
  }

  trackNavigateToProduct(
    productId: number,
    productDescription: string | undefined
  ) {
    console.info('analytics.trackNavigateToProduct', productId);
    this.shoppingGoogleEvent('select_item', {
      items: [
        {
          item_id: `${productId}`,
          item_name: `${productDescription}`,
        },
      ],
    });
  }

  trackAddProductToCart(productId: number) {
    console.info('analytics.trackAddProductToCart', productId);
    this.shoppingGoogleEvent('add_to_cart', {
      items: [
        {
          item_id: `${productId}`,
          item_name: `${productId}`,
        },
      ],
    });
  }

  // GOOOGLE

  public trackEcommerce(eventType: EventType) {
    this.shoppingGoogleEvent(googleEventTypeEnum[eventType], {
      items: [item, item],
    });
  }

  private shoppingGoogleEvent(event: googleEventType, data: GA4Data) {
    // view_item_list     Medir impressões e visualizações da lista de itens/produtos
    // select_item        Medir cliques na lista de itens/produtos
    // view_item          Medir visualizações e impressões de detalhes de itens/produtos
    // add_to_cart        Medir adições ou remoções de um carrinho de compras
    // remove_from_cart   Medir adições ou remoções de um carrinho de compras
    // begin_checkout     Medir uma finalização de compra
    // view_promotion     Medir promoções
    // select_promotion   Medir cliques na promoção

    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce: data });
  }

  // Medir compras
  private purchase() {
    // return {
    //   event: 'purchase',
    //   {
    //     affiliation: 'Google Store',
    //     coupon: 'SUMMER_FUN',
    //     currency: 'USD',
    //     items: [{
    //       item_id: 'SKU_12345',
    //       item_name: 'jeggings',
    //       coupon: 'SUMMER_FUN',
    //       discount: 2.22,
    //       affiliation: 'Google Store',
    //       item_brand: 'Gucci',
    //       item_category: 'pants',
    //       item_variant: 'black',
    //       price: 9.99,
    //       currency: 'USD',
    //       quantity: 1
    //     }, {
    //       item_id: 'SKU_12346',
    //       item_name: 'jeggings',
    //       coupon: 'SUMMER_FUN',
    //       discount: 2.22,
    //       affiliation: 'Google Store',
    //       item_brand: 'Gucci',
    //       item_category: 'pants',
    //       item_variant: 'gray',
    //       price: 9.99,
    //       currency: 'USD',
    //       quantity: 1
    //     }],
    //     transaction_id: 'T_12345',
    //     shipping: 3.33,
    //     value: 21.09,
    //     tax: 2.22
    //   }
    // }
  }

  private refund() {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'refund',
      ecommerce: {
        transaction_id: 'T12345',
      },
    });
  }
}
