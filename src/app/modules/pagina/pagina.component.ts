import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
