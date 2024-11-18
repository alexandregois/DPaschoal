import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { BasicInfoCustomer } from '@models/basicInfoCustomer.model';
import {
  CentroDistribuicao,
  CentrosDistribuicao,
  Espelho,
  NotaEspelho,
} from '@models/warranty.model';
import { CadastroService } from '@modules/cadastro/cadastro.service';
import { GarantiaService } from '@modules/garantias/garantia/garantia.service';
import { StoreService } from '@shared/services/store.service';

@Component({
  selector: 'app-espelho-nota',
  templateUrl: './espelho-nota.component.html',
  styleUrls: ['./espelho-nota.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspelhoNotaComponent implements OnInit, OnChanges {
  @Input()
  printed!: boolean;

  @Input()
  conteudo!: Espelho;
  @Input()
  impostos!: NotaEspelho;
  @Input()
  cnpjCustomer!: string;
  @Input()
  dadosCnpj!: BasicInfoCustomer;
  @Input()
  centros!: CentrosDistribuicao;
  @Input()
  centro!: CentroDistribuicao;

  constructor() {}

  ngOnChanges(): void {
    if (this.printed) {
      window.print();
    }
  }

  ngOnInit(): void {}
}
