import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { ColeccionesService } from '../../services/colecciones.service';
import { Coleccion } from '../../models/coleccion.model';

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [CommonModule, MarcoMaderaComponent, MarcoPapelComponent],
  templateUrl: './colecciones.component.html',
  styleUrl: './colecciones.component.scss'
})
export class ColeccionesComponent implements OnInit {
  colecciones: Coleccion[] = [];
  cargando = true;

  // Inyectamos el servicio
  constructor(private coleccionesService: ColeccionesService) {}

  ngOnInit() {
    // Aquí simulamos datos para que puedas trabajar SIN el backend prendido por ahora.
    // Cuando esté listo el backend, descomentas la llamada al servicio.

    this.colecciones = [
      { idColeccion: 1, nombreColeccion: 'Renacimiento 8-Bits', descripcionColeccion: 'Clásicos en pixeles', fechaInicio: '2024-01-01', fechaFin: '2024-03-01' },
      { idColeccion: 2, nombreColeccion: 'Paisajes Oníricos', descripcionColeccion: 'Sueños digitales', fechaInicio: '2024-04-01', fechaFin: '2024-06-01' }
    ] as any;
    this.cargando = false;

    /* --- CÓDIGO REAL PARA CUANDO CONECTES EL BACKEND ---
    this.coleccionesService.getColecciones().subscribe({
      next: (res) => {
        this.colecciones = res.data;
        this.cargando = false;
      },
      error: (err) => console.error(err)
    });
    */
  }
}
