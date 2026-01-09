import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable para el buscador
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
  terminoBusqueda = '';

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
        // Datos falsos de respaldo por si el back falla
        this.categorias = [
          { idCategoria: 1, nombreCategoria: 'Pintura al Óleo', descripcionCategoria: 'Técnicas clásicas.' },
          { idCategoria: 2, nombreCategoria: 'Escultura Digital', descripcionCategoria: 'Modelado 3D.' },
          { idCategoria: 3, nombreCategoria: 'Fotografía', descripcionCategoria: 'Capturas reales.' },
          { idCategoria: 4, nombreCategoria: 'Pixel Art', descripcionCategoria: 'Arte 8-bits.' }
        ] as any;
      }
    });
  }

  // 1. Lógica del Buscador
  get categoriasFiltradas() {
    return this.categorias.filter(cat =>
      cat.nombreCategoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  // 2. Lógica de Paginación (Qué mostrar en pantalla)
  get datosPaginados() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    return this.categoriasFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  // 3. AQUÍ ESTÁ LA SOLUCIÓN DEL ERROR MATH
  // Calculamos el total de páginas aquí dentro
  get totalPaginas(): number {
    return Math.ceil(this.categoriasFiltradas.length / this.itemsPorPagina);
  }

  // Control de botones
  siguientePagina() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  onSearch() {
    this.paginaActual = 0; // Reiniciar a página 1 si buscas
  }

  verObras(id: number) {
    this.router.navigate(['/obras-filtradas', 'categoria', id]);
  }
}
