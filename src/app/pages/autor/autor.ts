import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { AutoresService } from '../../services/autores.service';
import { ObrasDigitalesService } from '../../services/obras.service';
import { Autor } from '../../models/autor.model';
import { ObraDigital } from '../../models/obra-digital.model';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";
import { BtnDelete } from "../../components/btn-delete/btn-delete";
import Swal from 'sweetalert2';
import { ArchivoDigital } from '../../models/archivo-digital.model';
import { forkJoin, of, switchMap } from 'rxjs';
import { ArchivoDigitalService } from '../../services/archivo-digital.service';


@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [
    CommonModule,
    MarcoMaderaComponent,
    MarcoPapelComponent,
    RouterModule,
    BtnPrimary,
    BtnDelete
],
  templateUrl: './autor.html',
  styleUrl: './autor.scss',
})
export class AutorPage implements OnInit {

  cargando = true;
  error = '';
  idAutor!: number;
  autor: Autor | undefined;
  obrasDigitales: ObraDigital[] = [];
  mostrarConfirmacion = false;
  eliminando = false;
  archivosMap = new Map<number, ArchivoDigital>();


  constructor(
    private route: ActivatedRoute,
    private autoresService: AutoresService,
    private obrasDigitalesService: ObrasDigitalesService,
    private archivoDigitalService: ArchivoDigitalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idAutor = Number(params.get('id'));
      this.getDatosAutor(this.idAutor);
      this.getObrasAutor(this.idAutor);
    });
  }

  getDatosAutor(id: number) {
    this.autoresService.getAutorPorId(id).subscribe({
      next: res => {
        this.autor = res.data;
        if(!(this.autor.avatar)) {
          this.autor.avatar = "/assets/avatar-default.jpg"
        }
        this.cargando = false;

        this.cdr.detectChanges();
      },
      error: err => {
        this.error = 'Error al cargar datos del autor';
        this.cargando = false;
        console.error(err);
      }
    })
  }

  getObrasAutor(id: number) {
    this.obrasDigitalesService.getObrasPorIdAutor(id).pipe(
      switchMap(res => {
        this.obrasDigitales = res.data;
        console.log(this.obrasDigitales)
        const idsArchivos = this.obrasDigitales
          .map(o => o.idArchivoPrincipal)
          .filter(id => id != null);

        if (!idsArchivos.length) {
          return of([]);
        }

        return forkJoin(
          idsArchivos.map(id =>
            this.archivoDigitalService.getArchivoPorId(id!)
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
        this.error = 'Error al cargar obras o archivos';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  getRutaArchivo(ruta: string): string {
    return ruta.replace('./', '/');
  }

  modificarAutor() {
    this.router.navigate(['/modificar-autor', this.idAutor]);
  }

  // ELIMINACIÓN ---------------------

  abrirConfirmacion() {
    this.mostrarConfirmacion = true;
  }

  cancelarEliminacion() {
    this.mostrarConfirmacion = false;
  }

  confirmarEliminacion() {
    this.eliminando = true;

    this.autoresService.eliminarAutor(this.idAutor).subscribe({
      next: () => {
        this.router.navigate(['/autores']);
      },
      error: err => {
        this.error = 'Error eliminando el autor';
        this.eliminando = false;
        this.mostrarConfirmacion = false;
        console.error(err);
      }
    });
  }

  // Registrar obras

  registarObraDigital() {
    this.router.navigate(['/autor', this.idAutor,'crear-obra']);
  }

  editarObra(id: number) {
    this.router.navigate(['/autor', this.idAutor,'modificar-obra', id]);
  }
  eliminarObra(id: number) {
    Swal.fire({
      title: '¿Eliminar obra?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#6b7280'
    }).then(result => {

      if (!result.isConfirmed) return;

      this.obrasDigitalesService.eliminarObra(id).subscribe({
        next: () => {
          this.obrasDigitales = this.obrasDigitales.filter(
            obra => obra.idObraDigital !== id
          );

          this.cdr.detectChanges();

          Swal.fire({
            title: 'Eliminada',
            text: 'La obra fue eliminada correctamente',
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: err => {
          console.error(err);

          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la obra',
            icon: 'error'
          });
        }
      });

    });
  }


  verObra(id: number) {}


}
