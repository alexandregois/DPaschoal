import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VideoResponseDto } from '@generated/api/api-external-svc/model/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-galeria-videos-produto',
  templateUrl: './galeria-videos-produto.component.html',
  styleUrls: ['./galeria-videos-produto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaleriaVideosProdutoComponent {
  constructor(private sanitizer: DomSanitizer) {}

  @Input()
  videos: Array<VideoResponseDto> | null | undefined;

  videoURL(url: string | null | undefined) {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : undefined;
  }

  anterior(): void {
    if (this.videos) {
      var ultimoIndice = this.videos.length - 1;
      var elm = this.videos[ultimoIndice];
      this.videos.pop();
      this.videos.unshift(elm);
    }
  }

  proximo(): void {
    if (this.videos) {
      var elm = this.videos[0];
      this.videos.shift();
      this.videos.push(elm);
    }
  }
}
