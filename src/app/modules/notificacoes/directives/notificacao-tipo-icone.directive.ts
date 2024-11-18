import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appNotificacaoTipoIcone]',
})
export class NotificacaoTipoIconeDirective implements OnChanges {
  @Input() appNotificacaoTipoIcone!: String | undefined;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this.notificacaoTipoIcone();
  }
  private notificacaoTipoIcone(): void {
    const icone = new Map();
    icone.set('Limite de Crédito', 'assessment');

    this.el.nativeElement.innerHTML =
      icone.get(this.appNotificacaoTipoIcone) || 'notifications';
  }
}
