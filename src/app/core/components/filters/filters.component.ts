import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
} from '@angular/core';
import { SessionService } from '@core/services/session.service';
import { StoreService } from '@shared/services/store.service';
import { Warehouse } from '@models/deposito.model';
import { FiltersService } from './filters.service';
import { Customer } from '@core/enum/auth.enum';
import { EventsApiService } from '@core/services/events-api.service';
import { ActivatedRoute } from '@angular/router';
import { BeOnService } from '@core/services/be-on.service';
import { DepositoService } from '@core/services/deposito.service';
import { CartDto } from '@generated/api/dpk-order-svc';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  constructor(
    private filtersService: FiltersService,
    private sessionService: SessionService,
    private store: StoreService,
    private event: EventsApiService,
    private route: ActivatedRoute,
    private beOn: BeOnService,
    private depositoService: DepositoService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  isLogged: boolean = false;
  warehousesByCategory: { [key: string]: Warehouse[] } = {};
  warehouses: Warehouse[] = [];
  showCategory: boolean = false;
  isLoadingWarehouse$ = this.store.getLoadingState('warehouse');
  selectedWarehouse: Warehouse | CartDto | null = null;
  selectedCategory: string | undefined | null;
  selectedWarehouseDescription?: string;

  ngOnInit() {
    this.store.getSelected('warehouse').subscribe((customerWarehouse) => {
      if (customerWarehouse) {
        localStorage.setItem(
          Customer.CUSTOMER_WAREHOUSE,
          JSON.stringify(customerWarehouse)
        );
      }
    });
    this.sessionService.getIsAuthSubject().subscribe((isAuth: boolean) => {
      if (isAuth) {
        this.isLogged = true;
        this.buscarWarehouses();
      } else {
        this.isLogged = false;
      }
    });
    this.depositoService.selectedDepositoForPayment$.subscribe(
      (selectedDeposito) => {
        if (selectedDeposito && selectedDeposito.id) {
          this.selectedWarehouse = selectedDeposito;
          this.selectedWarehouseDescription = selectedDeposito.description;
          if (selectedDeposito.isAntigo) {
            this.setWarehouse(selectedDeposito);
          } else {
            const warehouse = this.warehousesByCategory[
              selectedDeposito.priceId
            ].find((item) => item.id === selectedDeposito.id);
            if (warehouse) {
              this.setWarehouse(warehouse);
            }
          }
        }
      }
    );
  }

  getWarehousesByCategory(category: string, warehouse?: Warehouse) {
    this.warehouses = this.warehousesByCategory[category];
    let index = 0;
    if (this.warehouses && warehouse) {
      index = this.warehouses.findIndex((dep) => dep.id === warehouse?.id);
    }
    this.setWarehouse(this.warehouses[index]);
  }

  private buscarWarehouses() {
    this.filtersService.buscarWarehouses().subscribe({
      next: (warehouseList) => {
        if (!warehouseList) {
          return;
        }
        let index = 0;
        const getSelectedWarehouse = this.store
          .getSelected('warehouse')
          .getValue();
        if (getSelectedWarehouse) {
          index = warehouseList.findIndex(
            (dep) => dep.id === getSelectedWarehouse.id
          );
        }
        this.setWarehousesByCategory(warehouseList);
        if (warehouseList[index].warehouseType) {
          this.getWarehousesByCategory(warehouseList[index].warehouseType!);
        }
        this.setWarehouse(warehouseList[index]);
      },
      // TODO Revisar tratamento de erro
      // error: () => this.snackBar.open('Erro ao buscar depósitos', 'Ok'),
    });
  }

  setWarehouse(selectedWarehouse: Warehouse) {
    const snapshot = this.route.firstChild?.firstChild?.snapshot;
    const index = this.warehouses.findIndex(
      (dep) => dep.id === selectedWarehouse.id
    );
    const warehouseType = this.warehouses[index].warehouseType;
    if (warehouseType) {
      this.selectedCategory = warehouseType;
    }
    this.selectedWarehouse = this.warehouses[index];
    this.store.setSelected('warehouse', selectedWarehouse);
    this.event.EventUpdateCD({ data: selectedWarehouse });
    this.selectedWarehouse = this.warehouses[index];
    this.selectedCategory = warehouseType;
    this.cdr.detectChanges();
  }

  private setWarehousesByCategory(warehouses: Warehouse[]): void {
    this.warehousesByCategory = this.groupByToMap(
      warehouses,
      (warehouse: Warehouse) => warehouse.warehouseType
    );
    if (warehouses[0] && warehouses[0].warehouseType) {
      this.getWarehousesByCategory(warehouses[0].warehouseType, warehouses[0]);
    }
    this.showCategory = Object.keys(this.warehousesByCategory).length > 1;
    if (!this.showCategory) {
      this.getWarehousesByCategory(warehouses[0].warehouseType!);
    }
  }

  private groupByToMap(list: any, keyGetter: any) {
    const map: { [key: string]: Warehouse[] } = {};
    list.forEach((item: any) => {
      const key = keyGetter(item);
      const collection = map[key];
      if (!collection) {
        map[key] = [item];
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
