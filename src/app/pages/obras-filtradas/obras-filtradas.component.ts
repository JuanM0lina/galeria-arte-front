import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { ObrasDigitalesService } from '../../services/obras.service';
import { ObraDigital } from '../../models/obra-digital.model';

@Component({
  selector: 'app-obras-filtradas',
  standalone: true,
  imports: [CommonModule, MarcoMaderaComponent, MarcoPapelComponent],
  templateUrl: './obras-filtradas.component.html',
  styleUrl: './obras-filtradas.component.scss' // Usa el mismo SCSS que autor.scss o copialo
})
export class ObrasFiltradasComponent implements OnInit {
  obras: ObraDigital[] = [];
  tituloPagina = 'Obras';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private obrasService: ObrasDigitalesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tipo = params.get('tipo'); // 'categoria' o 'coleccion'
      const id = Number(params.get('id'));

      if (tipo === 'categoria') {
        this.tituloPagina = 'Obras por Categoría';
        this.cargarPorCategoria(id);
      } else if (tipo === 'coleccion') {
        this.tituloPagina = 'Obras de la Colección';
        this.cargarPorColeccion(id);
      }
    });
  }

  cargarPorCategoria(id: number) {
    this.obrasService.getObrasPorCategoria(id).subscribe({
      next: (res) => {
        this.obras = res.data || [];
        this.cargando = false;
      },
      error: (err) => { console.error(err); this.cargando = false; }
    });
  }

  cargarPorColeccion(id: number) {
    this.obrasService.getObrasPorColeccion(id).subscribe({
      next: (res) => {
        this.obras = res.data || [];
        this.cargando = false;
      },
      error: (err) => { console.error(err); this.cargando = false; }
    });
  }

  volver() {
    // Regresa a la página anterior
    window.history.back();
  }
}
