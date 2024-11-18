import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CARRINHO,
  CONTATO,
  CREDITO,
  FAVORITOS,
  FINANCEIRO,
  GARANTIA,
  HOME,
  KITS,
  MINHA_CONTA,
  OFERTAS,
  PEDIDOS,
  PERGUNTAS_FREQUENTES,
  QUEM_SOMOS,
  WHATSAPP,
} from '@core/constants/navigation.constant';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SitemapComponent {
  links = [
    HOME,
    CARRINHO,
    CONTATO,
    CREDITO,
    FAVORITOS,
    FINANCEIRO,
    GARANTIA,
    KITS,
    MINHA_CONTA,
    OFERTAS,
    PEDIDOS,
    PERGUNTAS_FREQUENTES,
    QUEM_SOMOS,
    WHATSAPP,
  ];
}
