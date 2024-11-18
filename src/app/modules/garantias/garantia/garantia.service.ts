import { Injectable } from '@angular/core';
import { environment } from '@env';
import {
  CdsService,
  CustomerService,
  DocumentService,
  InvoiceService,
  MaterialService,
  ProductService,
  WarrantyService,
} from '@generated/api/dpk-warranty-svc';
import {
  CentrosDistribuicao,
  Customer,
  Espelho,
  GarantiaCreat,
  GarantiaOrigin,
  Invoice,
  ProdutoBusca,
  ProdutoDocument,
  RetornoGarantiaOrigin,
  RetornoProdutoDocument,
  StatusGarantia,
} from '@models/warranty.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GarantiaService {
  constructor(
    private cdService: CdsService,
    private productService: ProductService,
    private materialService: MaterialService,
    private customerService: CustomerService,
    private service: WarrantyService,
    private invoiceService: InvoiceService,
    private documentService: DocumentService
  ) {}

  // TODO: SUBSTITUIR ANY
  public getGarantiaByNumber(number: string): Observable<any> {
    return this.service.warrantyProtocolGet(number, environment.portal);
  }

  public buscarEnderecoCentrosDistribuicao(): Observable<CentrosDistribuicao> {
    return this.cdService.cdsRecuperaCdsPost(environment.portal, []);
  }

  public pesquisarProdutos(termo: string): Observable<Array<ProdutoBusca>> {
    return this.productService.productPost(environment.portal, [termo]);
  }

  public getDocumentos(
    params: ProdutoDocument
  ): Observable<Array<RetornoProdutoDocument>> {
    return this.documentService.documentGetSupplierPost(
      environment.portal,
      params
    );
  }

  // TODO: SUBSTITUIR ANY
  public pesquisarMaterial(productId: string): Observable<any> {
    return this.materialService.materialRecuperaMaterialPost(
      environment.portal,
      {
        correlationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        MATNR: productId,
      }
    );
  }

  public getNotasProdutos(
    garantia: GarantiaOrigin
  ): Observable<RetornoGarantiaOrigin> {
    return this.invoiceService.invoiceInvoiceMirrorPost(
      environment.portal,
      garantia
    );
  }

  // TODO: SUBSTITUIR ANY
  public gerarGarantia(garantia: GarantiaCreat): Observable<any> {
    return this.service.warrantyPost(undefined, environment.portal, garantia);
  }

  public validarCustomer(): Observable<Customer> {
    return this.customerService.customerGet();
  }

  public sendFileInvoice(protocolo: string, file: File): Observable<boolean> {
    return this.invoiceService.invoiceWarrantyNumberPost(
      protocolo,
      environment.portal,
      file
    );
  }

  public updateInvoiceStatus(
    invoice: Invoice
  ): Observable<{ erro: string; sucesso: string }> {
    return this.customerService.customerStatusCustomerNfePut(
      environment.portal,
      invoice
    );
  }

  public getDadosEspelhoNota(protocolo: string): Observable<Array<Espelho>> {
    return this.service.warrantyProtocolInvoicesGet(protocolo);
  }

  public updateStatus(
    statusGarantia: StatusGarantia
  ): Observable<{ erro: string; sucesso: string }> {
    return this.service.warrantyStatusSapPut(
      environment.portal,
      statusGarantia
    );
  }
}
