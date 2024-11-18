import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Avaliacao } from '@models/pedidos.model';

@Component({
  selector: 'dialog-avaliar-pedido-modal',
  templateUrl: './avaliar-pedido-modal.component.html',
  styleUrls: ['./avaliar-pedido-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvaliarPedidoModalComponent {
  nota: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public codigoPedido: number) {}

  mostrarModal: boolean = false;

  avaliacao: Avaliacao = {
    codigoPedido: this.codigoPedido,
    nota: 0,
    comentario: '',
  };

  enviar(): void {
    this.avaliacao.nota = this.nota;

    if (this.avaliacao.codigoPedido != 0) {
      alert(
        'enviar avaliação >> ' +
          'codigoPedido: ' +
          this.avaliacao.codigoPedido +
          ' nota: ' +
          this.avaliacao.nota +
          ' comentario: ' +
          this.avaliacao.comentario
      );
    } else {
      alert('Pedido não informado!');
    }
  }
}
