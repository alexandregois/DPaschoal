import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { environment } from '@env';
import { ProdutoBusca, ProdutoNota } from '@models/warranty.model';

@Component({
  selector: 'app-notas-produto-selecionado-card',
  templateUrl: './notas-produto-selecionado-card.component.html',
  styleUrls: ['./notas-produto-selecionado-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotasProdutoSelecionadoCardComponent implements OnInit {
  panelOpenState = false;

  environment = environment;

  @Input()
  produtoNota!: ProdutoNota;

  @Output() editarProduto = new EventEmitter<ProdutoBusca>();

  constructor() {}

  ngOnInit(): void {}
}
