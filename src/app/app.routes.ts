import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
    title: 'About Me | Pablo Gozálvez',
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./components/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
    title: 'Projects | Pablo Gozálvez',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
    title: 'Contact | Pablo Gozálvez',
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent
      ),
    title: 'Error | Pablo Gozálvez',
  },
  {
    path: '404',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent
      ),
    data: { errorCode: '404' },
    title: 'Error 404 | Pablo Gozálvez',
  },
  { path: '**', redirectTo: '/404' },
];
