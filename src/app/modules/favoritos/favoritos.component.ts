import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductFavoriteDto } from '@generated/api/dpk-product-svc';
import { finalize } from 'rxjs';
import { FavoritosService } from './favoritos.service';
import { SnackBarColorService } from '@shared/services/snackbarColor.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritosComponent extends MatPaginatorIntl implements OnInit {
  constructor(
    private service: FavoritosService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private snackbarColorService: SnackBarColorService
  ) {
    super();
  }

  override lastPageLabel = 'Ultima página';
  override nextPageLabel = 'Próxima página';
  override firstPageLabel = 'Primeira página';
  override previousPageLabel = 'Pagina anterior';
  override itemsPerPageLabel = 'Itens por página:';
  length = 0;
  pageSize = 8;
  pageIndex = 0;

  favoritos: Array<ProductFavoriteDto> = [];
  favoritosPorPagina: Array<ProductFavoriteDto> = [];

  isLoading: boolean = true;

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
  };

  ngOnInit() {
    this.buscarFavoritos();
    this.getRangeLabel(this.pageIndex, this.pageSize, this.length);
  }

  buscarFavoritos(): void {
    this.isLoading = true;
    this.service
      .buscarFavoritos()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.favoritosPorPagina = this.favoritos.slice(
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize
          );
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (favs) => {
          this.length = favs.length;
          this.favoritos = favs;
        },
        error: () =>
          this.snackBar.open(
            'Erro ao buscar os favoritos',
            'Ok',
            this.snackbarColorService.getSnackBarConfig()
          ),
      });
  }

  mudarPagina(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.favoritosPorPagina = this.favoritos.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }
}
