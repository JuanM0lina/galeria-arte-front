import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { ColeccionesService } from '../../services/colecciones.service';
import { Coleccion } from '../../models/coleccion.model';
import { BtnPrimary } from '../../components/btn-primary/btn-primary';
import { BtnReporteComponent } from '../../components/btn-reporte/btn-reporte.component';

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [
    CommonModule,
    MarcoMaderaComponent,
    MarcoPapelComponent,
    FormsModule,
    BtnPrimary,
    BtnReporteComponent
  ],
  templateUrl: './colecciones.component.html',
  styleUrl: './colecciones.component.scss'
})
export class ColeccionesComponent implements OnInit {
  
  cargando = true;
  colecciones: Coleccion[] = [];
  coleccionesFiltradas: Coleccion[] = [];
  datosPaginados: Coleccion[] = [];

  paginaActual = 0;
  itemsPorPagina = 2;
  terminoBusqueda = '';

  constructor(
    private colService: ColeccionesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.colService.getColecciones().subscribe({
      next: (res) => {
        this.colecciones = res.data ?? [];
        this.filtrarCategorias();
        this.actualizarPaginacion();
        this.cargando = false;
        this.cdr.detectChanges();
        console.log(this.colecciones)
      },
      error: () => this.cargando = false
    });
  }

  // ------- Paginación -------

  get totalPaginas(): number {
    return Math.ceil(this.coleccionesFiltradas.length / this.itemsPorPagina);
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

  actualizarPaginacion() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.datosPaginados = this.coleccionesFiltradas.slice(inicio, fin);
  }

  filtrarCategorias() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.coleccionesFiltradas = this.colecciones.filter(col =>
      col.nombreColeccion.toLowerCase().includes(termino)
    );
    this.paginaActual = Math.min(this.paginaActual, Math.max(this.totalPaginas - 1, 0));
  }

  verObras(id: number) {
    this.router.navigate(['/obras-filtradas', 'coleccion', id]);
  }

  crearColeccion() {
    this.router.navigate(['/crear-coleccion']);
  }
}
