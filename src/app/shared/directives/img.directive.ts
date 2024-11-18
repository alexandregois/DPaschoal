import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[app-img]',
})
export class ImgDirective {
  constructor(private elementRef: ElementRef) {}

  @Output() loaded = new EventEmitter();

  @HostListener('error')
  imageLoaded() {
    this.elementRef.nativeElement.src = '/assets/svg/image-placeholder.svg';
  }
}
