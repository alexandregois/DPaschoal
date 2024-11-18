import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from '@core/enum/invoice.enum';
import { FinancialDto } from '@generated/api/dpk-financial-svc/model/financialDto';
import { FileService } from '@shared/services/file.service';
import { TabEmAbertoService } from './tab-em-aberto.service';
import { Router } from '@angular/router';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';
import { FinancialSecuritiesDto } from '@generated/api/dpk-financial-svc';

@Component({
  selector: 'app-tab-em-aberto',
  templateUrl: './tab-em-aberto.component.html',
  styleUrls: ['./tab-em-aberto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabEmAbertoComponent {
  displayedColumns: (keyof FinancialDto | string)[] = [
    'invoiceNumber',
    'number',
    'parcel',
    'issueDate',
    'dueDate',
    'parcelValue',
    'currentValue',
    'xml',
    'danfe',
    'boleto',
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
    private data: TabEmAbertoService,
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

    var data = localStorage.getItem('dataEmAberto');
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

    this.data.fetch(skip, top, Invoice.EM_ABERTO).subscribe({
      next: (response) => {
        if (response.securities) {
          this.dataSource.data = response.securities;
        }
        if (response) {
          let autoCredData = {
            url: response.url,
            sapCliente: response.sapCliente,
            user: response.user,
            password: response.password,
          };
          localStorage.setItem('autoCredData', JSON.stringify(autoCredData));
        }
      },
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () => {
        this.isLoading = false;
        localStorage.setItem(
          'dataEmAberto',
          JSON.stringify(this.dataSource.data)
        );
        this.cdr.markForCheck();
      },
    });
  }

  loadDataMore() {
    this.isLoadingMore = true;

    // TODO: alterar para receber os dados quando tiver massa de dados
    const top: number = 20;
    this.skipPage += 20;

    this.data.fetch(this.skipPage, top, Invoice.EM_ABERTO).subscribe({
      next: (response) => {
        var data = localStorage.getItem('dataEmAberto');
        if (data) var oldData = JSON.parse(data);
        this.dataSource.data = oldData;
        response.securities?.forEach((value: any) => {
          this.dataSource.data.push(value);
        });
        this.dataSource.data = this.dataSource.data.slice();
      },
      complete: () => {
        this.isLoadingMore = false;
        localStorage.setItem(
          'dataEmAberto',
          JSON.stringify(this.dataSource.data)
        );
        this.cdr.markForCheck();
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

  // TODO: Aguardando massa de dados
  getInvoice(documentNumber: string, exercise: string, company: string) {
    this.data.getInvoice(documentNumber, exercise, company).subscribe({
      next: () => {},
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () =>
        this.snackBar.open(
          'Arquivo aberto em outra janela!',
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        ),
    });
  }

  // TODO: Aguardando massa de dados
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
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () => {
        this.pendingDownload[pageIndex][index][type] = false;
        this.cdr.markForCheck();
        this.snackBar.open(
          'Arquivo aberto em outra janela!',
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        );
      },
    });
  }

  // TODO: Aguardando massa de dados
  getSecuritiesDocument(billCode: string) {
    this.data.getSecuritiesDocument(billCode).subscribe({
      next: (data) => this.fileService.openFile(data),
      // TODO Revisar tratamento de erro
      // error: error => this.snackBar.open(error, 'Ok'),
      complete: () =>
        this.snackBar.open(
          'Arquivo aberto em outra janela!',
          'Ok',
          this.snackbarColorService.getSnackBarConfig()
        ),
    });
  }
}
