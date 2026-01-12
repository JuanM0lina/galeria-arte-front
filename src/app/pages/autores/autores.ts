import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { AutoresService } from '../../services/autores.service';
import { Autor } from '../../models/autor.model';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";
import { BtnReporteComponent } from '../../components/btn-reporte/btn-reporte.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [
    CommonModule,
    MarcoMaderaComponent,
    MarcoPapelComponent,
    FormsModule,
    NgIf,
    NgFor,
    RouterModule,
    BtnPrimary,
    BtnReporteComponent,
],
  templateUrl: './autores.html',
  styleUrl: './autores.scss',
})
export class Autores implements OnInit {

  cargando = true;
  autores: Autor[] = [];
  autoresFiltrados: Autor[] = [];
  datosPaginados: Autor[] = [];
  
  paginaActual = 0;
  itemsPorPagina = 10;
  terminoBusqueda = '';
  
  error = '';
  
  constructor(
    private autoresService: AutoresService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarAutores();
  }

  cargarAutores() {
    this.autoresService.getAutores().subscribe({
      next: res => {
        this.autores = res.data ?? [];
        this.filtrarAutores();
        this.actualizarPaginacion();
        this.cargando = false;
        console.log(this.autores);

        this.cdr.detectChanges();
      },
      error: err => {
        this.error = 'Error al cargar autores';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  irAutor(id: number) {
    this.router.navigate(['/autor', id]);
  }

  crearAutor() {
    this.router.navigate(['/crear-autor']);
  }

  // -------- Filtrado --------

  
  get totalPaginas(): number {
    return Math.ceil(this.autoresFiltrados.length / this.itemsPorPagina);
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
    this.filtrarAutores();
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.datosPaginados = this.autoresFiltrados.slice(inicio, fin);
    this.cdr.detectChanges();
  }

  filtrarAutores() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.autoresFiltrados = this.autores.filter(autor =>
      autor.nombreCompleto.toLowerCase().includes(termino)
    );
    this.paginaActual = Math.min(this.paginaActual, Math.max(this.totalPaginas - 1, 0));
  }
}
