import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ImageResponseDto } from '@generated/api/api-external-svc/model/models';
import { environment } from '@env';

@Component({
  selector: 'app-galeria-fotos-produto',
  templateUrl: './galeria-fotos-produto.component.html',
  styleUrls: ['./galeria-fotos-produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleriaFotosProdutoComponent {
  constructor() {}

  @Input()
  fotos: Array<ImageResponseDto> | null | undefined;

  @Output()
  fotoSelecionada = new EventEmitter<ImageResponseDto>();

  environment = environment;

  anterior(): void {
    if (this.fotos) {
      var ultimoIndice = this.fotos.length - 1;
      var elm = this.fotos[ultimoIndice];
      this.fotos.pop();
      this.fotos.unshift(elm);
    }
  }

  proxima(): void {
    if (this.fotos) {
      var elm = this.fotos[0];
      this.fotos.shift();
      this.fotos.push(elm);
    }
  }

  selecionarFoto(foto: ImageResponseDto): void {
    this.fotoSelecionada.emit(foto);
  }
}
