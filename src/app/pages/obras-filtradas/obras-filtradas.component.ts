import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { ObrasDigitalesService } from '../../services/obras.service';
import { ObraDigital } from '../../models/obra-digital.model';
import { BtnReporteComponent } from '../../components/btn-reporte/btn-reporte.component';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";
import { FormsModule } from '@angular/forms';
import { ArchivoDigital } from '../../models/archivo-digital.model';
import { forkJoin, of, switchMap } from 'rxjs';
import { ArchivoDigitalService } from '../../services/archivo-digital.service';
import { ColeccionObraService } from '../../services/coleccion-obra.service';

@Component({
  selector: 'app-obras-filtradas',
  standalone: true,
  imports: [
    CommonModule,
    MarcoMaderaComponent,
    MarcoPapelComponent,
    BtnReporteComponent,
    BtnPrimary,
    FormsModule,
  ],
  templateUrl: './obras-filtradas.component.html',
  styleUrl: './obras-filtradas.component.scss'
})
export class ObrasFiltradasComponent implements OnInit {
  
  tituloPagina = 'Obras';
  cargando = true;

  tipoFiltro: 'obras-categoria' | 'obras-coleccion' | null = null;
  idFiltro: number | null = null;

  // Obras en la colección (arriba)
  obrasFiltradas: ObraDigital[] = [];

  // Obras disponibles (abajo)
  obrasDisponibles: ObraDigital[] = [];
  obrasDisponiblesFiltradas: ObraDigital[] = [];
  disponiblesPaginadas: ObraDigital[] = [];

  // UI
  filtroDisponibles = '';
  paginaDisponibles = 0;
  itemsPorPaginaDisponibles = 6;

  // Archivos
  archivosMap = new Map<number, any>();
  obrasMap = new Map<number, ObraDigital>();

  constructor(
    private route: ActivatedRoute,
    private obrasService: ObrasDigitalesService,
    private coleccionObraService: ColeccionObraService,
    private archivoDigitalService: ArchivoDigitalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tipo = params.get('tipo');
      const id = Number(params.get('id'));

      if (tipo === 'coleccion') {
        this.tipoFiltro = 'obras-coleccion';
        this.idFiltro = id;
        this.cargarVistaColeccion(id);
      }

      // ⛔ NO implementar categorías todavía
    });
  }
  
  cargarVistaColeccion(idColeccion: number) {
    this.cargando = true;

    forkJoin({
      obrasColeccion: this.coleccionObraService.getObrasDeColeccion(idColeccion),
      todasLasObras: this.obrasService.getObras()
    }).pipe(
      switchMap(({ obrasColeccion, todasLasObras }) => {

        // 1️⃣ Crear mapa de TODAS las obras completas
        this.obrasMap.clear();
        (todasLasObras.data || []).forEach(obra => {
          this.obrasMap.set(obra.idObraDigital, obra);
        });

        // 2️⃣ Reconstruir obras de la colección con datos completos
        this.obrasFiltradas = (obrasColeccion.data || [])
          .map(o => this.obrasMap.get(o.idObraDigital))
          .filter((o): o is ObraDigital => !!o);

        // 3️⃣ Obras disponibles
        const idsEnColeccion = this.obrasFiltradas.map(o => o.idObraDigital);

        this.obrasDisponibles = (todasLasObras.data || [])
          .filter(o => !idsEnColeccion.includes(o.idObraDigital));

        this.obrasDisponiblesFiltradas = [...this.obrasDisponibles];
        this.paginarDisponibles();

        // 4️⃣ Archivos (igual que antes)
        const idsArchivos = [...this.obrasFiltradas, ...this.obrasDisponibles]
          .map(o => o.idArchivoPrincipal)
          .filter(id => id != null) as number[];

        const unicos = [...new Set(idsArchivos)];
        if (!unicos.length) return of([]);

        return forkJoin(
          unicos.map(id =>
            this.archivoDigitalService.getArchivoPorId(id)
          )
        );
      })
    ).subscribe({
      next: archivos => {
        archivos.forEach(res => {
          const archivo = res.data;
          this.archivosMap.set(archivo.idArchivo, archivo);
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
  }


  agregarAColeccion(obra: ObraDigital) {
    if (!this.idFiltro) return;

    this.coleccionObraService.crearObraCategoria({
      idObraDigital: obra.idObraDigital,
      idColeccion: this.idFiltro // (nombre se corrige luego)
    }).subscribe({
      next: () => {
        this.obrasFiltradas.push(obra);
        this.obrasDisponibles =
          this.obrasDisponibles.filter(o => o.idObraDigital !== obra.idObraDigital);

        this.filtrarDisponibles();
      }
    });
  }

  eliminarDeColeccion(obra: ObraDigital) {
    if (!this.idFiltro) return;

    this.coleccionObraService
      .eliminarObraCategoriaPorIds(this.idFiltro, obra.idObraDigital)
      .subscribe({
        next: () => {
          this.obrasFiltradas =
            this.obrasFiltradas.filter(o => o.idObraDigital !== obra.idObraDigital);

          this.obrasDisponibles.push(obra);
          this.filtrarDisponibles();
        }
      });
  }

  cargarYFiltrar(tipo: string | null, id: number) {
    this.cargando = true;

    this.obrasService.getObras().pipe(
      switchMap(res => {
        const todas = res.data || [];
        this.aplicarFiltro(todas, tipo, id);

        // IDs únicos de archivos (de AMBAS listas)
        const idsArchivos = [...this.obrasFiltradas, ...this.obrasDisponibles]
          .map(o => o.idArchivoPrincipal)
          .filter(id => id != null) as number[];

        const idsUnicos = [...new Set(idsArchivos)];

        if (!idsUnicos.length) {
          return of([]);
        }

        return forkJoin(
          idsUnicos.map(id =>
            this.archivoDigitalService.getArchivoPorId(id)
          )
        );
      })
    ).subscribe({
      next: archivos => {
        archivos.forEach(res => {
          const archivo = res.data;
          this.archivosMap.set(archivo.idArchivo, archivo);
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error cargando obras o archivos', err);
        this.cargando = false;
      }
    });
  }


  aplicarFiltro(todas: ObraDigital[], tipo: string | null, id: number) {
    if (tipo === 'categoria') {
      this.tituloPagina = 'Obras por Categoría';

      this.obrasFiltradas = todas.filter(
        o => o.categoria?.idCategoria === id
      );

      this.obrasDisponibles = todas.filter(
        o => o.categoria?.idCategoria !== id
      );

    } else if (tipo === 'coleccion') {
      this.tituloPagina = 'Obras de la Colección';

      this.obrasFiltradas = todas.filter(
        o => o.coleccion?.idColeccion === id
      );

      this.obrasDisponibles = todas.filter(
        o => o.coleccion?.idColeccion !== id
      );

    } else {
      this.obrasFiltradas = todas;
      this.obrasDisponibles = [];
    }

    this.filtrarDisponibles();
  }

  filtrarDisponibles() {
    const filtro = this.filtroDisponibles.toLowerCase();

    this.obrasDisponiblesFiltradas = this.obrasDisponibles.filter(o =>
      o.titulo.toLowerCase().includes(filtro)
    );

    this.paginaDisponibles = 0;
    this.paginarDisponibles();
  }

  paginarDisponibles() {
    const start = this.paginaDisponibles * this.itemsPorPaginaDisponibles;
    this.disponiblesPaginadas =
      this.obrasDisponiblesFiltradas.slice(
        start,
        start + this.itemsPorPaginaDisponibles
      );
  }

  siguienteDisponibles() {
    this.paginaDisponibles++;
    this.paginarDisponibles();
  }

  anteriorDisponibles() {
    this.paginaDisponibles--;
    this.paginarDisponibles();
  }


  getRutaArchivo(ruta: string): string {
    return ruta.replace('./', '/');
  }

  volver() { window.history.back(); }
}
