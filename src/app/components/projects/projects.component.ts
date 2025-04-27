import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/projects';
import { ProjectsService } from './services/projects.service';
import { ProjectCardComponent } from './project-card/project-card.component';

@Component({
  selector: 'projects',
  templateUrl: './projects.component.html',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
})
export class ProjectsComponent {
  #projectService = inject(ProjectsService);
  projects = signal<Project[]>([]);

  constructor() {
    this.projects.set(this.#projectService.getProjects());
  }
}
