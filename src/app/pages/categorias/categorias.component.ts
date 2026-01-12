import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { BtnPrimary } from '../../components/btn-primary/btn-primary';
import { BtnDelete } from '../../components/btn-delete/btn-delete';
import { BtnReporteComponent } from '../../components/btn-reporte/btn-reporte.component';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    MarcoMaderaComponent,
    MarcoPapelComponent,
    FormsModule,
    BtnPrimary,
    BtnDelete,
    BtnReporteComponent
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {

  cargando = true;
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  datosPaginados: Categoria[] = [];
  
  paginaActual = 0;
  itemsPorPagina = 3;
  terminoBusqueda = '';

  catEliminar?: Categoria;
  mostrarConfirmacion = false;
  eliminando = false;

  constructor(
    private catService: CategoriasService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.catService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res.data ?? [];
        this.filtrarCategorias();
        this.actualizarPaginacion();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error Back', err);
        this.cargando = false;
      }
    });
  }

  // ------- Paginación -------

  get totalPaginas(): number {
    return Math.ceil(this.categoriasFiltradas.length / this.itemsPorPagina);
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  onSearch() {
    this.paginaActual = 0;
    this.filtrarCategorias();
    this.actualizarPaginacion();
  }

  eliminarCategoriaLocal(id: number) {
    this.categorias = this.categorias.filter(c => c.idCategoria !== id);
    this.filtrarCategorias();
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.datosPaginados = this.categoriasFiltradas.slice(inicio, fin);
  }

  filtrarCategorias() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.categoriasFiltradas = this.categorias.filter(cat =>
      cat.nombreCategoria.toLowerCase().includes(termino)
    );
    this.paginaActual = Math.min(this.paginaActual, Math.max(this.totalPaginas - 1, 0));
  }

  verObras(id: number) {
    this.router.navigate(['/obras-filtradas', 'categoria', id]);
  }

  crearCategoria() {
    this.router.navigate(['/crear-categoria']);
  }

  editarCategoria(cat: Categoria) {
    this.router.navigate(['/modificar-categoria', cat.idCategoria]);
  }

  // --- LÓGICA DE ELIMINACIÓN---

  abrirConfirmacion(cat: Categoria) {
    this.mostrarConfirmacion = true;
    this.catEliminar = cat;
  }

  cancelarEliminacion() {
    this.mostrarConfirmacion = false;
    this.catEliminar = undefined;
  }

  confirmarEliminacion() {
    this.eliminando = true;
    if(!(this.catEliminar?.idCategoria)) return;

    let id = this.catEliminar?.idCategoria;

    this.catService.eliminarCategoria(id).subscribe({
      next: () => {
        this.eliminarCategoriaLocal(id);
        this.mostrarConfirmacion = false;
        this.eliminando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.eliminando = false;
        this.mostrarConfirmacion = false;
        console.error(err);
      }
    });
  }
}
