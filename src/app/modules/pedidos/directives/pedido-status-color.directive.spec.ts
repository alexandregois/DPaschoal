import { ElementRef } from '@angular/core';

import { PedidoStatusColorDirective } from './pedido-status-color.directive';

describe('PedidoStatusColorDirective', () => {
  let el: ElementRef;

  it('should create an instance', () => {
    const directive = new PedidoStatusColorDirective(el);
    expect(directive).toBeTruthy();
  });
});
