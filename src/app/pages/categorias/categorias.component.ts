import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, MarcoMaderaComponent, MarcoPapelComponent, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  cargando = true;

  // Variables para Paginación y Búsqueda
  paginaActual = 0;
  itemsPorPagina = 3;
  terminoBusqueda = ''; // Lo que escribe el usuario

  constructor(
    private categoriasService: CategoriasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoriasService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res.data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  // Filtro por búsqueda
  get categoriasFiltradas() {
    return this.categorias.filter(cat =>
      cat.nombreCategoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  // Paginamos lo que ya fue filtrado
  get datosPaginados() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    return this.categoriasFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  // Control de paginas
  siguientePagina() {
    if ((this.paginaActual + 1) * this.itemsPorPagina < this.categoriasFiltradas.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  // Cuando buscan, reseteamos a la pagina 0 para que no se pierdan
  onSearch() {
    this.paginaActual = 0;
  }

  // Navegar a la vista de obras
  verObras(id: number, nombre: string) {
    // Pasamos el ID y el nombre.
    this.router.navigate(['/obras-filtradas', 'categoria', id]);
  }
}
