import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appPedidoStatusColor]',
})
export class PedidoStatusColorDirective implements OnChanges {
  @Input() appPedidoStatusColor!: Number | undefined;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this.pedidoStatusColor();
  }
  private pedidoStatusColor(): void {
    const estado = new Map();
    estado.set('1', 'dimgray');
    estado.set('2', 'blue');
    estado.set('3', 'green');
    estado.set('4', 'gray');
    estado.set('5', 'fireBrick');

    if (this.el.nativeElement.localName == 'mat-chip') {
      this.el.nativeElement.style.color = 'white';
      this.el.nativeElement.style.backgroundColor = estado.get(
        this.appPedidoStatusColor
      );
    } else {
      this.el.nativeElement.style.color = estado.get(this.appPedidoStatusColor);
    }
  }
}
