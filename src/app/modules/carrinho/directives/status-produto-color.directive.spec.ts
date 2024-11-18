import { ElementRef } from '@angular/core';
import { StatusProdutoColorDirective } from './status-produto-color.directive';

describe('StatusProdutoColorDirective', () => {
  let el: ElementRef;
  it('should create an instance', () => {
    const directive = new StatusProdutoColorDirective(el);
    expect(directive).toBeTruthy();
  });
});
