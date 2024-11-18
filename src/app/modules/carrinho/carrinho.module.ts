import { CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FavoritoButtonModule } from '@shared/components/favorito-button/favorito-button.module';
import { SharedModule } from '@shared/shared.module';

import { CarrinhoRoutingModule } from './carrinho-routing.module';
import { CarrinhoComponent } from './carrinho.component';

import { CardAddressComponent } from './components/card-address/card-address.component';
import { CardCartItemComponent } from './components/card-cart-item/card-cart-item.component';
import { CardPaymentComponent } from './components/card-payment/card-payment.component';
import { CardShippingSelectComponent } from './components/card-shipping-select/card-shipping-select.component';
import { CardShippingComponent } from './components/card-shipping/card-shipping.component';
import { StatusProdutoComponent } from './components/status-produto/status-produto.component';
import { TableResumoPedidoComponent } from './components/table-resumo-pedido/table-resumo-pedido.component';
import { StatusProdutoColorDirective } from './directives/status-produto-color.directive';
import { FinalizarComponent } from './finalizar/finalizar.component';
import { FreteComponent } from './frete/frete.component';
import { PagamentoComponent } from './pagamento/pagamento.component';
import { FormCartaoCreditoComponent } from './components/form-cartao-credito/form-cartao-credito.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    CarrinhoComponent,
    PagamentoComponent,
    FreteComponent,
    FinalizarComponent,
    StatusProdutoComponent,
    StatusProdutoColorDirective,
    CardAddressComponent,
    CardPaymentComponent,
    CardShippingComponent,
    CardShippingSelectComponent,
    CardCartItemComponent,
    TableResumoPedidoComponent,
    FormCartaoCreditoComponent,
  ],
  providers: [CurrencyPipe],
  imports: [SharedModule, CarrinhoRoutingModule, FavoritoButtonModule],
})
export class CarrinhoModule {}
