import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { ColeccionesService } from '../../services/colecciones.service';
import { Coleccion } from '../../models/coleccion.model';

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [CommonModule, MarcoMaderaComponent, MarcoPapelComponent, FormsModule],
  templateUrl: './colecciones.component.html',
  styleUrl: './colecciones.component.scss'
})
export class ColeccionesComponent implements OnInit {
  colecciones: Coleccion[] = [];
  cargando = true;
  paginaActual = 0;
  itemsPorPagina = 2;
  terminoBusqueda = '';

  constructor(private colService: ColeccionesService, private router: Router) {}

  ngOnInit() {
    this.colService.getColecciones().subscribe({
      next: (res) => {
        this.colecciones = res.data || [];
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  get coleccionesFiltradas() {
    return this.colecciones.filter(col =>
      col.nombreColeccion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  get datosPaginados() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    return this.coleccionesFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  // SOLUCIÓN AL ERROR MATH:
  get totalPaginas(): number {
    return Math.ceil(this.coleccionesFiltradas.length / this.itemsPorPagina);
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas - 1) this.paginaActual++;
  }

  anteriorPagina() {
    if (this.paginaActual > 0) this.paginaActual--;
  }

  onSearch() { this.paginaActual = 0; }

  verObras(id: number) {
    this.router.navigate(['/obras-filtradas', 'coleccion', id]);
  }
}
