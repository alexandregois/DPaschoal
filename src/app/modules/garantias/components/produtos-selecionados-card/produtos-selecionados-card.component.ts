import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '@env';
import { ProdutoBusca } from '@models/warranty.model';

@Component({
  selector: 'app-produtos-selecionados-card',
  templateUrl: './produtos-selecionados-card.component.html',
  styleUrls: ['./produtos-selecionados-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutosSelecionadosCardComponent implements OnInit {
  constructor() {}

  @Input()
  produtosSelecionados!: Array<ProdutoBusca>;

  @Output() adicionar = new EventEmitter<ProdutoBusca>();

  @Output() remover = new EventEmitter<number>();

  environment = environment;

  ngOnInit(): void {}

  atualizarProduto(qtd: number, produto: any) {
    if (produto === null) {
      return;
    }
    produto.quantidadeSelecionada = qtd;
    this.adicionar.emit(produto);
  }

  removerProduto(produto: any) {
    this.remover.emit(produto.id);
  }
}
