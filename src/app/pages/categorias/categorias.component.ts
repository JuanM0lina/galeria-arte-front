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
  paginaActual = 0;
  itemsPorPagina = 3;
  terminoBusqueda = '';

  constructor(private catService: CategoriasService, private router: Router) {}

  ngOnInit() {
    this.catService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res.data || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error Back, usando local:', err);
        // DATOS LOCALES (MOCKS)
        this.categorias = [
          { idCategoria: 1, nombreCategoria: 'Pintura al Óleo', descripcionCategoria: 'Técnicas clásicas.' },
          { idCategoria: 2, nombreCategoria: 'Escultura Digital', descripcionCategoria: 'Modelado 3D.' },
          { idCategoria: 3, nombreCategoria: 'Fotografía', descripcionCategoria: 'Capturas del mundo real.' },
          { idCategoria: 4, nombreCategoria: 'Pixel Art', descripcionCategoria: 'Arte punto a punto.' }
        ] as any;
        this.cargando = false;
      }
    });
  }

  get categoriasFiltradas() {
    return this.categorias.filter(cat =>
      cat.nombreCategoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  get datosPaginados() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    return this.categoriasFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  // GETTER PARA CORREGIR EL ERROR DEL MATH
  get totalPaginas(): number {
    return Math.ceil(this.categoriasFiltradas.length / this.itemsPorPagina);
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas - 1) this.paginaActual++;
  }

  anteriorPagina() {
    if (this.paginaActual > 0) this.paginaActual--;
  }

  onSearch() { this.paginaActual = 0; }

  verObras(id: number) {
    this.router.navigate(['/obras-filtradas', 'categoria', id]);
  }
}
