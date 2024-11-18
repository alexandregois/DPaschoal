import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { EventsApiService } from '@core/services/events-api.service';
import { SessionService } from '@core/services/session.service';
import { ProductFavoriteDto } from '@generated/api/dpk-product-svc';
import { Warehouse } from '@models/deposito.model';
import { StoreService } from '@shared/services/store.service';

@Component({
  selector: 'app-favorito-button',
  templateUrl: './favorito-button.component.html',
  styleUrls: ['./favorito-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritoButtonComponent implements OnChanges {
  constructor(
    private events: EventsApiService,
    private store: StoreService,
    private cdr: ChangeDetectorRef,
    private sessionService: SessionService
  ) {}

  deposito!: Warehouse;
  isFavorito!: boolean;
  favoritoDto!: ProductFavoriteDto;
  isLogged: boolean = false;
  isLoading: boolean = true;

  @Input()
  sapCode: number | undefined;

  @Input()
  idProduct: number | undefined;

  ngOnChanges(): void {
    this.isAuthSubject();
    this.buscarDeposito();
  }

  private isAuthSubject(): void {
    const isAuth = this.sessionService.getIsAuthSubject().getValue();
    this.isLogged = isAuth;
    if (isAuth) {
      this.consultarFavorito();
    }
  }

  buscarDeposito(): void {
    const depo = this.store.getSelected('warehouse').getValue();
    if (depo) {
      this.deposito = depo;
    }
    this.cdr.markForCheck();
  }

  consultarFavorito(): void {
    if (!this.sapCode) {
      this.isLoading = false;
      return;
    }
    this.events.checkProductOnBookmarks({
      data: {
        produtosId: [this.sapCode],
      },
      callback: (result: any) => {
        this.favoritoDto = result ? result[0] : {};
        this.isFavorito = result ? true : false;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  addFavorito(): void {
    this.isLoading = true;
    if (!this.sapCode || !this.deposito || !this.idProduct) {
      this.isLoading = false;
      return;
    }
    this.events.addProductToBookmarks({
      data: {
        depositoId: this.deposito.retailerId,
        produtoErpId: this.sapCode,
        produtoId: this.idProduct,
      },
      callback: (result: any) => {
        this.isLoading = false;
        if (result) {
          this.isFavorito = true;
        }
        this.favoritoDto.id = result;
        this.cdr.markForCheck();
      },
    });
  }

  removerFavorito(): void {
    this.isLoading = true;
    if (!this.favoritoDto || !this.favoritoDto.id) {
      this.isLoading = false;
      return;
    }
    this.events.removeProductFromBookmarks({
      data: {
        produtoId: this.favoritoDto.id,
      },
      callback: (result: any) => {
        this.isLoading = false;
        this.isFavorito = result;
        this.cdr.markForCheck();
      },
    });
  }
}
