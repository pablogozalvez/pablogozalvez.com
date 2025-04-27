import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [CommonModule, HighlightDirective],
})
export class AboutComponent {}
