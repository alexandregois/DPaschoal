import { ElementRef } from '@angular/core';

import { NotificacaoTipoIconeDirective } from './notificacao-tipo-icone.directive';

describe('NotificacaoTipoIconeDirective', () => {
  let el: ElementRef;

  it('should create an instance', () => {
    const directive = new NotificacaoTipoIconeDirective(el);
    expect(directive).toBeTruthy();
  });
});
