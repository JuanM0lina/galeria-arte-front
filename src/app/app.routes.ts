import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Autores } from './pages/autores/autores';
import { AutorPage } from './pages/autor/autor';
import { ModificarAutor } from './pages/modificar-autor/modificar-autor';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'autores', component: Autores },
  { path: 'autor/:id', component: AutorPage },
  { path: 'crear-autor', component: ModificarAutor},
  { path: 'modificar-autor/:id', component: ModificarAutor},
];
