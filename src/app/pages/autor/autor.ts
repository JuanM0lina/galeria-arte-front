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

  constructor(
    private route: ActivatedRoute,
    private autoresService: AutoresService,
    private obrasDigitalesService: ObrasDigitalesService,
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
    this.obrasDigitalesService.getObrasPorIdAutor(id).subscribe({
      next: res => {
        this.obrasDigitales = res.data;
        this.cargando = false;
        console.log("Obras digitales", this.obrasDigitales);
        this.cdr.detectChanges();
      },
      error: err => {
        this.error = 'Error al cargar obras digitales del autor';
        this.cargando = false;
        console.error(err);
      }
    })
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
  eliminarObra(id: number) {}
  verObra(id: number) {}


}