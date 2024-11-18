import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { environment } from '@env';
import { SvgIconService } from '@shared/services/svg-icon.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  environment = environment;

  constructor(private svgIcon: SvgIconService) {
    this.svgIcon.set(`logo`, `/assets/svg/logo.svg`);
    this.svgIcon.set(`facebook`, `/assets/svg/facebook.svg`);
    this.svgIcon.set(`instagram`, `/assets/svg/instagram.svg`);
    this.svgIcon.set(`linkedin`, `/assets/svg/linkedin.svg`);
    this.svgIcon.set(`youtube`, `/assets/svg/youtube.svg`);
  }
}
