import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AutoresService } from '../../services/autores.service';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";

@Component({
  selector: 'app-modificar-autor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MarcoMaderaComponent,
    NgIf,
    NgFor,
    BtnPrimary
],
  templateUrl: './modificar-autor.html',
  styleUrl: './modificar-autor.scss'
})
export class ModificarAutor implements OnInit {

  esEdicion = false;
  autorId?: number;
  form: any;
  datos: object = {};
  erroresBackend: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private autoresService: AutoresService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      idAutor: [{ value: null, disabled: true }],
      nombreCompleto: [''],
      correoContacto: [''],
      avatar: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.esEdicion = true;
        this.autorId = Number(id);
        this.cargarAutor(this.autorId);
      } else {
        this.esEdicion = false;
        this.form.reset();
      }
    });
  }

  cargarAutor(id: number) {
    this.autoresService.getAutorPorId(id).subscribe(res => {
      this.form.patchValue(res.data);
    });
  }

  guardar() {
    if (this.form.invalid) return;
    this.erroresBackend = [];

    if (this.esEdicion) {
      this.autoresService.actualizarAutor(this.autorId!, this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/autor/'+this.autorId])
        },
        error: (err) => {
          if (err.status === 400 && err.error?.errors) {
            this.erroresBackend = err.error.errors;
          } else {
            this.erroresBackend = ['Ocurrió un error inesperado'];
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      this.autoresService.crearAutor(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/autores'])
        },
        error: (err) => {
          if (err.status === 400 && err.error?.errors) {
            this.erroresBackend = err.error.errors;
          } else {
            this.erroresBackend = ['Ocurrió un error inesperado'];
          }
          this.cdr.detectChanges();
        }
      });
    }
  }
}
