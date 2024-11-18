import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appStatusProdutoColor]',
})
export class StatusProdutoColorDirective implements OnChanges {
  @Input() appStatusProdutoColor!: string | undefined;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this.statusProdutoColor();
  }

  private statusProdutoColor(): void {
    const status = new Map();
    status.set('1', '#e31b0c'); // item indisponivel
    status.set('2', '#7b1fa2'); // item bloqueado
    status.set('3', '#7E0F0F'); // minimo de itens
    status.set('4', '#F8BC1B'); // maximo em estoque

    if (this.el.nativeElement.localName == 'mat-chip') {
      this.el.nativeElement.style.color = 'white';
      this.el.nativeElement.style.backgroundColor = status.get(
        this.appStatusProdutoColor
      );
    } else {
      this.el.nativeElement.style.color = status.get(
        this.appStatusProdutoColor
      );
    }
  }
}
