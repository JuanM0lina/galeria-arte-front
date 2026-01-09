import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el buscador
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

  // Variables para paginacion y busqueda
  paginaActual = 0;
  itemsPorPagina = 2;
  terminoBusqueda = '';

  constructor(
    private coleccionesService: ColeccionesService,
    private router: Router
  ) {}

  ngOnInit() {

    this.coleccionesService.getColecciones().subscribe({
      next: (res) => {
        this.colecciones = res.data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando colecciones', err);
        this.cargando = false;
        // Datos falsos
        this.colecciones = [
           { idColeccion: 1, nombreColeccion: 'Renacimiento 8-Bits', descripcionColeccion: 'Clásicos en pixeles', fechaInicio: new Date('2024-01-01'), fechaFin: new Date('2024-03-01') },
           { idColeccion: 2, nombreColeccion: 'Paisajes Oníricos', descripcionColeccion: 'Sueños digitales', fechaInicio: new Date('2024-04-01'), fechaFin: new Date('2024-06-01') },
           { idColeccion: 3, nombreColeccion: 'Ciberpunk 2077', descripcionColeccion: 'Neon y futuro', fechaInicio: new Date('2024-07-01'), fechaFin: new Date('2024-09-01') }
        ] as any;
      }
    });
  }

  // Filtro por texto
  get coleccionesFiltradas() {
    return this.colecciones.filter(col =>
      col.nombreColeccion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  get datosPaginados() {
    const inicio = this.paginaActual * this.itemsPorPagina;
    return this.coleccionesFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }


  get totalPaginas(): number {
    return Math.ceil(this.coleccionesFiltradas.length / this.itemsPorPagina);
  }

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
    this.paginaActual = 0; // Reiniciar a página 1 si buscas algo nuevo
  }

  verObras(id: number) {
    this.router.navigate(['/obras-filtradas', 'coleccion', id]);
  }
}
