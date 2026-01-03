import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Autor } from './pages/autor/autor';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'autor/:id', component: Autor },
];
