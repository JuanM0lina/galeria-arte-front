import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Autores } from './pages/autores/autores';
import { AutorPage } from './pages/autor/autor';
import { ModificarAutor } from './pages/modificar-autor/modificar-autor';
import { ModificarObra } from './pages/modificar-obra/modificar-obra';
import { ColeccionesComponent } from './pages/colecciones/colecciones.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ObrasFiltradasComponent } from './pages/obras-filtradas/obras-filtradas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'autores', component: Autores },
  { path: 'autor/:id', component: AutorPage },
  { path: 'crear-autor', component: ModificarAutor},
  { path: 'modificar-autor/:id', component: ModificarAutor},
  { path: 'autor/:idAutor/crear-obra', component: ModificarObra},
  { path: 'autor/:idAutor/modificar-obra/:id', component: ModificarObra},
  { path: 'colecciones', component: ColeccionesComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'obras-filtradas/:tipo/:id', component: ObrasFiltradasComponent },

];
