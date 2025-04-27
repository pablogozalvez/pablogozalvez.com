import {
  Directive,
  ElementRef,
  AfterViewInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import hljs from 'highlight.js';

@Directive({
  selector: '[codeHighlight]',
  standalone: true,
})
export class HighlightDirective implements AfterViewInit {
  #el = inject(ElementRef<HTMLElement>);
  #platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.#platformId)) return;

    const element = this.#el.nativeElement;

    if (element.dataset['highlighted'] === 'yes') return;

    hljs.highlightElement(this.#el.nativeElement);
  }
}
