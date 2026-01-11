import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
// Autores
import { Autores } from './pages/autores/autores';
import { AutorPage } from './pages/autor/autor';
import { ModificarAutor } from './pages/modificar-autor/modificar-autor';
import { ModificarObra } from './pages/modificar-obra/modificar-obra';
// Obras digitales
import { ObrasFiltradasComponent } from './pages/obras-filtradas/obras-filtradas.component';
// Colecciones
import { ColeccionesComponent } from './pages/colecciones/colecciones.component';
import { ModificarColeccion } from './pages/modificar-coleccion/modificar-coleccion';
// Categorías
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ModificarCategoria } from './pages/modificar-categoria/modificar-categoria';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  // Autores
  { path: 'autores', component: Autores },
  { path: 'autor/:id', component: AutorPage },
  { path: 'crear-autor', component: ModificarAutor},
  { path: 'modificar-autor/:id', component: ModificarAutor},
  // Obras digitales
  { path: 'obras-filtradas/:tipo/:id', component: ObrasFiltradasComponent },
  { path: 'autor/:idAutor/crear-obra', component: ModificarObra},
  { path: 'autor/:idAutor/modificar-obra/:id', component: ModificarObra},
  // Colecciones
  { path: 'colecciones', component: ColeccionesComponent },
  { path: 'crear-coleccion', component: ModificarColeccion },
  { path: 'modificar-coleccion/:id', component: ModificarColeccion},
  // Categorías
  { path: 'categorias', component: CategoriasComponent },
  { path: 'crear-categoria', component: ModificarCategoria },
  { path: 'modificar-categoria/:id', component: ModificarCategoria},
];
