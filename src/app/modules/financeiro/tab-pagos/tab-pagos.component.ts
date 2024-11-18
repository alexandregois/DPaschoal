import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from '@core/enum/invoice.enum';
import {
  FinancialDto,
  FinancialSecuritiesDto,
} from '@generated/api/dpk-financial-svc';
import { FileService } from '@shared/services/file.service';
import { TabPagosService } from './tab-pagos.service';
import { Router } from '@angular/router';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
@Component({
  selector: 'app-tab-pagos',
  templateUrl: './tab-pagos.component.html',
  styleUrls: ['./tab-pagos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabPagosComponent {
  pageSizeOptions: number[] = [10, 25, 50];
  displayedColumns: (keyof FinancialDto | string)[] = [
    'invoiceNumber',
    'number',
    'parcel',
    'issueDate',
    'dueDate',
    'parcelValue',
    'status',
    'xml',
    'danfe',
  ];

  dataSource: MatTableDataSource<FinancialSecuritiesDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtro = this.fb.group({
    filtroNota: [''],
  });

  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  isShowPagination: boolean = false;
  skipPage: number = 0;

  pendingDownload: {
    [key: number]: {
      [key: number]: {
        [key: string]: boolean;
      };
    };
  } = {};

  constructor(
    private fb: NonNullableFormBuilder,
    private data: TabPagosService,
    private readonly cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private router: Router,
    private snackbarColorService: SnackBarColorService
  ) {
    this.dataSource = new MatTableDataSource();
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;

    var data = localStorage.getItem('dataPagos');
    if (data) {
      var parsedData = JSON.parse(data);
      this.dataSource = new MatTableDataSource(parsedData);
      await this.delay(5000);
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    // TODO: alterar para receber os dados quando tiver massa de dados
    const skip: number = 0; // param inicial paginacao
    const top: number = 20; // param final paginacao

    this.data.fetch(skip, top, Invoice.PAGOS).subscribe({
      next: (response) => {
        if (response.securities) {
          this.dataSource.data = response.securities;
        }
      },
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () => {
        this.isLoading = false;
        localStorage.setItem('dataPagos', JSON.stringify(this.dataSource.data));
        this.cdr.markForCheck();
        this.router.navigate(['/financeiro']);
      },
    });
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  loadDataMore() {
    this.isLoadingMore = true;

    // TODO: alterar para receber os dados quando tiver massa de dados
    const top: number = 20; // param final paginacao
    this.skipPage += 20; // adiciona mais registros a pesquisa

    this.data.fetch(this.skipPage, top, Invoice.PAGOS).subscribe({
      next: (response) => {
        var data = localStorage.getItem('dataPagos');
        if (data) var oldData = JSON.parse(data);
        this.dataSource.data = oldData;
        response.securities?.forEach((value: any) => {
          this.dataSource.data.push(value);
        });
        this.dataSource.data = this.dataSource.data.slice();
      },
      complete: () => {
        this.isLoadingMore = false;
        localStorage.setItem('dataPagos', JSON.stringify(this.dataSource.data));
        this.cdr.markForCheck();
      },
    });
  }

  applyFilter() {
    this.dataSource.filterPredicate = (
      data: FinancialSecuritiesDto,
      filter: string
    ) => {
      return data.invoiceNumber === filter;
    };

    const filtroNota = this.filtro.get('filtroNota')?.value;
    if (filtroNota !== undefined) this.dataSource.filter = filtroNota;
  }

  getInvoiceDocument(
    documentNumber: string,
    type: string,
    pageIndex: number,
    index: number
  ) {
    if (!this.pendingDownload[pageIndex]) {
      this.pendingDownload[pageIndex] = {};
    }

    if (!this.pendingDownload[pageIndex][index]) {
      this.pendingDownload[pageIndex][index] = {};
    }

    this.pendingDownload[pageIndex][index][type] = true;

    this.data.getInvoiceDocument(documentNumber, type).subscribe({
      next: (data) => this.fileService.openFile(data),
      // TODO Revisar tratamento de erro
      complete: () => {
        this.pendingDownload[pageIndex][index][type] = false;
        this.cdr.markForCheck();
        this.snackBar.open(
          'Download do arquivo concluido com sucesso!',
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        );
      },
    });
  }
}
