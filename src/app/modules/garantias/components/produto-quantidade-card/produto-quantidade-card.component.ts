import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '@env';
import { PortalService } from '@shared/services/portal.service';
import { ProdutoBusca } from '@models/warranty.model';

@Component({
  selector: 'app-produto-quantidade-card',
  templateUrl: './produto-quantidade-card.component.html',
  styleUrls: ['./produto-quantidade-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoQuantidadeCardComponent implements OnInit {
  constructor(private portalService: PortalService) {}

  @Input()
  produto!: ProdutoBusca | null;

  @Output() retorno = new EventEmitter<ProdutoBusca>();

  environment = environment;
  distribuidoPor!: string;
  quantidade: number = 1;

  ngOnInit(): void {
    this.quantidade = this.produto?.quantidadeSelecionada || 1;
    this.distribuidoPor = this.portalService.distribuidoPor(this.produto?.dpk);
  }

  atualizarProduto(qtd: number) {
    if (this.produto === null) {
      return;
    }
    this.produto.quantidadeSelecionada = qtd;
    this.retorno.emit(this.produto);
  }
}
