import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '@env';
import { PortalService } from '@shared/services/portal.service';
import { ProdutoBusca } from '@models/warranty.model';

@Component({
  selector: 'app-produto-busca-card',
  templateUrl: './produto-busca-card.component.html',
  styleUrls: ['./produto-busca-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProdutoBuscaCardComponent implements OnInit {
  @Input()
  produto!: ProdutoBusca;

  @Output() selecionado = new EventEmitter<ProdutoBusca>();

  environment = environment;
  distribuidoPor!: string;

  constructor(private portalService: PortalService) {}

  ngOnInit(): void {
    this.distribuidoPor = this.portalService.distribuidoPor(this.produto?.dpk);
  }
}
