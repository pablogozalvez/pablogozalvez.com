import { Component, input } from '@angular/core';
import { Project } from '../../../interfaces/projects';

@Component({
  selector: 'project-card',
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
