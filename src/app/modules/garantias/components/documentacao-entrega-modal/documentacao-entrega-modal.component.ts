import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { environment } from '@env';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RetornoProdutoDocument } from '@models/warranty.model';

@Component({
  selector: 'app-documentacao-entrega-modal',
  templateUrl: './documentacao-entrega-modal.component.html',
  styleUrls: ['./documentacao-entrega-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentacaoEntregaModalComponent implements OnInit {
  environment = environment;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Array<RetornoProdutoDocument>
  ) {}

  ngOnInit(): void {}
}
