import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { ObrasDigitalesService } from '../../services/obras.service';
import { ObraDigital } from '../../models/obra-digital.model';

@Component({
  selector: 'app-obras-filtradas',
  standalone: true,
  imports: [CommonModule, MarcoMaderaComponent, MarcoPapelComponent],
  templateUrl: './obras-filtradas.component.html',
  styleUrl: './obras-filtradas.component.scss'
})
export class ObrasFiltradasComponent implements OnInit {
  obrasFiltradas: ObraDigital[] = [];
  tituloPagina = 'Obras';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private obrasService: ObrasDigitalesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tipo = params.get('tipo');
      const id = Number(params.get('id'));
      this.cargarYFiltrar(tipo, id);
    });
  }

  cargarYFiltrar(tipo: string | null, id: number) {
    this.cargando = true;

    this.obrasService.getObras().subscribe({
      next: (res) => {
        const todas = res.data || [];
        this.aplicarFiltro(todas, tipo, id);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error conectando al back, usando datos locales:', err);
        const mockObras: ObraDigital[] = [
          {
            idObraDigital: 101, titulo: 'Mona Lisa Pixel', descripcion: 'Obra maestra en 8 bits.', fechaPublicacion: '2024-01-01', idAutor: 1, idArchivoPrincipal: null,
            categoria: { idCategoria: 1, nombreCategoria: 'Pixel Art' },
            coleccion: { idColeccion: 1, nombreColeccion: 'Renacimiento 8-Bits' }
          },
          {
            idObraDigital: 102, titulo: 'David Voxel', descripcion: 'Escultura digital.', fechaPublicacion: '2024-02-15', idAutor: 1, idArchivoPrincipal: null,
            categoria: { idCategoria: 2, nombreCategoria: 'Escultura Digital' },
            coleccion: { idColeccion: 1, nombreColeccion: 'Renacimiento 8-Bits' }
          }
        ];
        this.aplicarFiltro(mockObras, tipo, id);
        this.cargando = false;
      }
    });
  }

  aplicarFiltro(todas: ObraDigital[], tipo: string | null, id: number) {
    if (tipo === 'categoria') {
      this.tituloPagina = 'Obras por Categoría';
      this.obrasFiltradas = todas.filter(o => o.categoria?.idCategoria === id);
    } else if (tipo === 'coleccion') {
      this.tituloPagina = 'Obras de la Colección';
      this.obrasFiltradas = todas.filter(o => o.coleccion?.idColeccion === id);
    } else {
      this.obrasFiltradas = todas;
    }
  }

  volver() { window.history.back(); }
}
