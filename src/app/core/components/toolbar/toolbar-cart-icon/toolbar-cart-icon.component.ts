import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { finalize, first, tap } from 'rxjs';
import { environment } from '@env';
import { StoreService } from '@shared/services/store.service';
import { SessionService } from '@core/services/session.service';
import { CartDto, CartService } from '@generated/api/dpk-order-svc';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { DocumentVisibilityService } from '@shared/services/document-visibility.service';

@Component({
  selector: 'app-toolbar-cart-icon',
  templateUrl: './toolbar-cart-icon.component.html',
  styleUrls: ['./toolbar-cart-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarCartIconComponent implements OnInit {
  isLoading$ = this.store.getLoadingState('cart');
  isSmallScreen$ = this.breakpoint.isSmallScreen();
  totalCount = 0;

  constructor(
    private session: SessionService,
    private store: StoreService,
    private breakpoint: BreakpointService,
    private documentVisibility: DocumentVisibilityService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.store
      .getData('cart')
      .subscribe((cartList) => this.setTotalCartItems(cartList));
    this.documentVisibility.state.subscribe((state) => {
      if (state === 'visible') {
        this.loadTotalCartItems();
      }
    });
    this.session.getIsAuthSubject().subscribe((isAuth: boolean) => {
      if (isAuth) {
        this.loadTotalCartItems();
      }
    });
  }

  loadTotalCartItems(): void {
    this.store.setLoadingState('cart', true);
    this.cartService
      .apiCartGetByFilterGet(environment.portal)
      .pipe(
        first(),
        tap((data) => this.store.setData('cart', data)),
        finalize(() => this.store.setLoadingState('cart', false))
      )
      .subscribe();
  }

  setTotalCartItems(cartList: CartDto[] | undefined): void {
    if (cartList && cartList.length > 0) {
      this.totalCount =
        cartList
          .map((cart) => cart.cartItems?.length)
          .reduce(
            (sum, current) => (sum ? sum : 0) + (current ? current : 0),
            0
          ) || 0;
    } else {
      this.totalCount = 0;
    }
  }
}
