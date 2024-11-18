import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { BeOnService } from '@core/services/be-on.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriasComponent {
  categoriaId: string | undefined;
  params: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beOn: BeOnService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    combineLatest([this.route.queryParams, this.route.params]).subscribe(
      ([queryParams, params]) => {
        this.params = this.beOn.prepareParams({ queryParams, params });
        if (Object.keys(this.params).length < 1) {
          this.router.navigate(['/']);
        }
      }
    );
  }
  ngOnInit(): void {
    this.initSearch();
    const searchLoader = document.querySelector(
      '#bn-search-loader'
    ) as HTMLScriptElement;

    if (searchLoader) {
      searchLoader.addEventListener('load', () => this.initSearch());
    }
  }

  initSearch() {
    this.beOn.loadSearch(this.params);
  }
}
