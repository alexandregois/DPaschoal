import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EquivalentResponseDto } from '@generated/api/api-external-svc/model/models';
import { environment } from '@env';

@Component({
  selector: 'app-galeria-similares-produto',
  templateUrl: './galeria-similares-produto.component.html',
  styleUrls: ['./galeria-similares-produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleriaSimilaresProdutoComponent {
  constructor() {}

  @Input()
  similares: Array<EquivalentResponseDto> | null | undefined;
  @Input()
  isLogged: boolean = false;
  @Input()
  isVisibleFavorite: boolean = true;

  environment = environment;

  anterior(): void {
    if (this.similares) {
      var ultimoIndice = this.similares.length - 1;
      var elm = this.similares[ultimoIndice];
      this.similares.pop();
      this.similares.unshift(elm);
    }
  }

  proxima(): void {
    if (this.similares) {
      var elm = this.similares[0];
      this.similares.shift();
      this.similares.push(elm);
    }
  }
}
