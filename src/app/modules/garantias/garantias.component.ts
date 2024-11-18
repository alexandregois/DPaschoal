import { GarantiasService } from '@modules/garantias/garantias.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Garantia } from '@models/warranty.model';

@Component({
  selector: 'app-garantias',
  templateUrl: './garantias.component.html',
  styleUrls: ['./garantias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GarantiasComponent implements OnInit {
  displayedColumns: string[] = [
    'statusColor',
    'warrantyStatus',
    'requestDate',
    'number',
    'warrantyStep',
    'detalhar',
  ];

  listaGarantias!: MatTableDataSource<Garantia>;

  formBusca = this._formBuilder.group({
    filterNumber: [''],
    filterStatus: ['0'],
  });

  isLoading = false;
  garantias: Garantia[] = [];
  statusList!: { id: number; name: string }[];

  qtdItensLista = 10;
  mostrouTodos = false;

  constructor(
    private service: GarantiasService,
    private cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder
  ) {
    this.listaGarantias = new MatTableDataSource<Garantia>([]);
  }

  ngOnInit(): void {
    this.formBusca.get('filterNumber')?.valueChanges.subscribe((termo) => {
      this.filterGarantias();
    });
    this.buscarGarantias();
    this.statusList = [
      {
        id: 1,
        name: 'Pendente',
      },
      {
        id: 2,
        name: 'Em Análise',
      },
      {
        id: 3,
        name: 'Finalizado',
      },
    ];
  }

  buscarGarantias(): void {
    this.isLoading = true;
    this.service.getListGarantias().subscribe({
      next: (resp) => {
        this.garantias = resp;
        this.filterGarantias();
        this.mostrouTodos =
          this.listaGarantias.data.length === this.garantias.length;
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  filterGarantias(): void {
    const termo = this.formBusca.get('filterNumber')?.value;
    const filterStatus = this.formBusca.get('filterStatus')?.value;
    let filteredGarantias = this.garantias;
    if (termo) {
      filteredGarantias = filteredGarantias.filter((elm) =>
        elm.number.includes(termo)
      );
    }
    if (filterStatus !== '0') {
      filteredGarantias = filteredGarantias.filter(
        (elm) => elm.statusDescription === filterStatus
      );
    }
    this.listaGarantias.data = filteredGarantias.slice(0, this.qtdItensLista);
  }

  filtrarPorStatus($event: any) {
    this.formBusca.get('filterStatus')?.setValue($event.value);
    this.filterGarantias();
  }

  loadMoreData() {
    this.qtdItensLista += 10;
    this.filterGarantias();
  }

  getStatusColor(row: any) {
    let color = '';
    switch (row.statusDescription) {
      case 'Pendente':
        color = 'danger';
        break;
      case 'Em Análise':
        color = 'warning';
        break;
      case 'Finalizado':
        color = 'success';
        break;
      default:
        color = 'default';
    }
    return color;
  }
}
