import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BuscaProdutoService } from '@core/services/busca-produto.service';
import { environment } from '@env';
import {
  ProductSearchDto,
  ProductSearchService,
} from '@generated/api/dpk-product-svc';
import { StoreService } from '@shared/services/store.service';
import { Subscription } from 'rxjs';
import { portals } from 'src/environments/portals';
@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFilterComponent implements OnInit {
  searchForm: FormGroup;
  isLoading = true;
  produtos: ProductSearchDto[] = [];
  public placaVeiculo: any | undefined;
  private subscription: Subscription = new Subscription();
  isClearingPlace = false;
  public showClearSearchIcon = false;
  public showClearPlaceIcon = false;
  warehouse$ = this.store.getSelected('warehouse');

  constructor(
    private buscaProdutoService: BuscaProdutoService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private productSearchService: ProductSearchService,
    private store: StoreService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      placeFilter: [''],
    });
    // this.searchForm.get('placeFilter')?.valueChanges.subscribe((value) => {
    //   if (value.length === 7) {
    //     this.filterSearch();
    //   }
    // });
  }

  ngOnInit(): void {
    this.searchForm.get('searchTerm')?.valueChanges.subscribe((value) => {
      this.showClearSearchIcon = !!value;
      this.cdr.markForCheck();
    });
    this.searchForm.get('placeFilter')?.valueChanges.subscribe((value) => {
      this.showClearPlaceIcon = !!value;
      this.cdr.markForCheck();
    });
  }

  filterSearch() {
    let searchTerm = this.searchForm?.get('searchTerm')?.value;
    let placeFilter = this.searchForm?.get('placeFilter')?.value;
    const isEmpty = placeFilter === '' ? true : false;
    //Caso só tenha o primeiro campo de pesquisa
    if (isEmpty) {
      if (!searchTerm || !searchTerm.trim()) {
        return;
      }
      this.buscaProdutoService.setSearchTerm(searchTerm);
      this.router.navigate(['/busca-produto']);
      this.cdr.markForCheck();
      return;
    }

    const retailerId = this.warehouse$?.value?.retailerId;
    let xPortal = environment.portal;
    if (environment.portal === portals.kdp && retailerId === 2) {
      xPortal = portals.dpk;
    }
    this.productSearchService
      .apiProductSearchPlateGet(xPortal, placeFilter)
      .subscribe(
        (getPlacas) => {
          this.placaVeiculo = getPlacas;
          if (searchTerm && this.placaVeiculo) {
            this.placaVeiculo = getPlacas;
            this.buscaProdutoService.setSearchTerm(
              `${searchTerm} ${this.placaVeiculo}`
            );
            this.router.navigate(['/busca-produto']);
            this.cdr.markForCheck();
          } else {
            this.buscaProdutoService.setSearchTerm(this.placaVeiculo);
            this.router.navigate(['/busca-produto']);
            this.cdr.markForCheck();
          }
        },
        (error) => {
          this.buscaProdutoService.setSearchTerm('');
          this.router.navigate(['/busca-produto']);
          this.cdr.markForCheck();
        }
      );
  }

  executeSearch() {
    const searchTerm = this.searchForm?.get('searchTerm')?.value;
    if (!searchTerm || !searchTerm.trim()) {
      return;
    }
    this.buscaProdutoService.setSearchTerm(searchTerm);
    this.router.navigate(['/busca-produto']);
    this.cdr.markForCheck();
  }

  clearSearch() {
    this.searchForm.get('searchTerm')?.setValue('');
  }

  clearPlace() {
    this.isClearingPlace = true;
    this.searchForm.get('placeFilter')?.setValue('');
    this.isClearingPlace = false;
    this.searchForm.get('placeFilter')?.setValue('', { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
