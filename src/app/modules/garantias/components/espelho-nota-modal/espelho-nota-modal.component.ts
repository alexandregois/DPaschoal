import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'app-espelho-nota-modal',
  templateUrl: './espelho-nota-modal.component.html',
  styleUrls: ['./espelho-nota-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspelhoNotaModalComponent implements OnInit {
  isPrinting = false;

  dadosNota!: Espelho;
  notaTotal!: NotaEspelho;

  loadingMirror: boolean = false;

  timeout: ReturnType<typeof setTimeout> | undefined;

  cnpjCustomer!: string;
  dadosCnpj!: BasicInfoCustomer;
  centros!: CentrosDistribuicao;
  centro!: CentroDistribuicao;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Array<Espelho>,
    private store: StoreService,
    private cadastroService: CadastroService,
    private garantiaService: GarantiaService
  ) {}

  ngOnInit(): void {
    if (this.data.length > 0) {
      this.loadingMirror = true;
      let dados = this.data;
      let valorTotal: number = 0;
      let somaNotas: any = {};
      let listaNotas: Array<NotaEspelho> = [];

      for (let i in dados) {
        for (let j in dados[i].items) {
          let item = dados[i].items[j];
          listaNotas.push(item);
          // Cálculo do valor do ICMS
          let icmsValor = item.icmsBase * item.icmsRate;
          item.icmsTax = icmsValor;
          // Cálculo do valor do IPI
          let ipiValor = item.ipiBase * item.ipiRate;
          item.ipiTax = ipiValor;
          // Atualização do valor total da nota
          valorTotal += item.liquidValue + icmsValor + ipiValor;
          somaNotas.icmsBase = (somaNotas.icmsBase || 0) + item.icmsBase;
          somaNotas.icmsRate = (somaNotas.icmsRate || 0) + item.icmsRate;
          somaNotas.icmsTax = (somaNotas.icmsTax || 0) + icmsValor;
          somaNotas.icmsTaxSituation =
            (somaNotas.icmsTaxSituation || 0) + item.icmsTaxSituation;

          somaNotas.ipiBase = (somaNotas.ipiBase || 0) + item.ipiBase;
          somaNotas.ipiRate = (somaNotas.ipiRate || 0) + item.ipiRate;
          somaNotas.ipiTax = (somaNotas.ipiTax || 0) + ipiValor;
        }
      }
      this.dadosNota = dados[0];
      this.dadosNota.invoiceUnitPrice = valorTotal;
      this.dadosNota.items = listaNotas;
      this.notaTotal = somaNotas;
      this.loadingMirror = false;
    }

    this.cnpjCustomer = this.store.getSelected('cnpj').value!;
    this.getDataFromCnpj();
    this.buscarCentros();
  }

  async getDataFromCnpj(): Promise<void> {
    this.dadosCnpj = await this.cadastroService.getDataFromCnpj(
      this.cnpjCustomer
    );
  }
  async buscarCentros(): Promise<void> {
    this.garantiaService.buscarEnderecoCentrosDistribuicao().subscribe({
      next: (resp) => {
        this.centros = resp;
      },
      complete: () => {
        this.preencherDadosCD();
      },
    });
  }
  preencherDadosCD() {
    this.centro = this.centros?.etCentro.filter(
      (cd) => cd.id.toString() === this.dadosNota.origin
    )[0];
  }
}
