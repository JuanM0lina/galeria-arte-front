import { Component, OnInit } from '@angular/core';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';
import { AutoresService } from '../../services/autores.service';
import { Autor } from '../../models/autor.model';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [
    MarcoMaderaComponent,
    MarcoPapelComponent,
    NgIf,
    NgFor,
    RouterModule,
    BtnPrimary
],
  templateUrl: './autores.html',
  styleUrl: './autores.scss',
})
export class Autores implements OnInit {

  autores: Autor[] = [];
  cargando = true;
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
        this.autores = res.data;
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
}
