import { Injectable } from '@angular/core';
import { ProductSearchDto } from '@generated/api/dpk-product-svc';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BuscaProdutoService {
  private currentSearchTerm?: string | null | undefined;
  dados: ProductSearchDto[] | undefined;

  constructor() {}

  private productsSubject = new BehaviorSubject<ProductSearchDto[]>([]);
  products$ = this.productsSubject.asObservable();

  private searchTermSubject = new BehaviorSubject<string | undefined | null>(
    undefined
  );
  searchTerm$ = this.searchTermSubject.asObservable();

  setSearchTerm(searchTerm: string): void {
    this.currentSearchTerm = searchTerm;
    localStorage.setItem('currentSearchTerm', searchTerm);
    this.searchTermSubject.next(searchTerm);
  }

  getSearchTerm(): string | null | undefined {
    this.currentSearchTerm = localStorage.getItem('currentSearchTerm');
    return this.currentSearchTerm;
  }

  clearSearchTerm() {
    localStorage.removeItem('currentSearchTerm');
    this.searchTermSubject.next(null);
  }
}
