import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BeOnService } from '@core/services/be-on.service';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscaComponent implements OnInit {
  constructor(private beOn: BeOnService) {}

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
    this.beOn.loadSearch(undefined);
  }
}
