import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesComponent implements OnInit {
  constructor() {}
  cookiesAceito: boolean = true;

  ngOnInit(): void {
    const allCookies = document.cookie;
    this.cookiesAceito = allCookies
      .split('; ')
      .find((row) => row.startsWith('aceiteUsuario='))
      ? true
      : false;
  }

  aceiteCookies(): void {
    let expire = new Date();
    expire.setFullYear(2100);
    document.cookie = 'aceiteUsuario=true;expires=' + expire.toUTCString() + '';
    this.cookiesAceito = true;
  }
}
