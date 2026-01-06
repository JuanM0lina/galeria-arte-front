import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";
import { NgIf, NgFor } from '@angular/common';
import { Categoria } from '../../models/categoria.model';
import { Coleccion } from '../../models/coleccion.model';
import { CategoriasService } from '../../services/categorias.service';
import { ObrasDigitalesService } from '../../services/obras.service';

@Component({
  selector: 'app-modificar-obra',
  imports: [
    BtnPrimary,
    MarcoMaderaComponent,
    NgIf,
    NgFor,
    ReactiveFormsModule,
  ],
  templateUrl: './modificar-obra.html',
  styleUrl: './modificar-obra.scss',
})
export class ModificarObra implements OnInit {

  esEdicion = false;
  idObraDigital?: number;
  form: any;
  idAutor?: number;
  erroresBackend: string[] = [];
  categorias: Categoria[] = [];
  colecciones: Categoria[] = [];
  error: string = "";

  constructor(
    private categoriasService: CategoriasService,
    private obrasService: ObrasDigitalesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      idObraDigital: [{ value: null, disabled: true }],
      titulo: [''],
      descripcion: [''],
      fechaPublicacion: [''],
      idAutor: [''],
      idArchivoPrincipal: [''],
      categorias: this.fb.array([]),
    });

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.idAutor = Number(params.get('idAutor'));

      this.form.patchValue({
        idAutor: this.idAutor
      });

      this.cargarCategorias();

      if (id) {
        this.esEdicion = true;
        this.idObraDigital = Number(id);

        this.form.patchValue({
          idObraDigital: this.idObraDigital
        });

        // aquí luego cargarás la obra
      } else {
        this.esEdicion = false;
      }
    });
  }


  guardar() {
    this.erroresBackend = [];

    if (this.form.invalid) return;

    if (!this.esEdicion) {

      const raw = this.form.value;
      if(!raw.fechaPublicacion) {
        this.erroresBackend.push('Fecha de publicación inválida');
        return;
      }

      const payload = {
        titulo: raw.titulo,
        descripcion: raw.descripcion,
        fechaPublicacion: new Date(raw.fechaPublicacion),
        idAutor: this.idAutor!,
        idArchivoPrincipal: null,
      };

      console.log(payload);
      const categoriasSeleccionadas = this.form.value.categorias
      .map((checked: boolean, i: number) =>
        checked ? this.categorias[i].idCategoria : null
      )
      .filter((v: number | null) => v !== null);
      console.log(categoriasSeleccionadas)

      /*this.obrasService.crearObra(payload).subscribe({
        next: () => {
          // redirigir, mensaje, etc.
        },
        error: err => {
          if (err.status === 400 && err.error?.errors) {
            this.erroresBackend = err.error.errors;
          } else {
            this.erroresBackend = ['Error al registrar la obra'];
          }
        }
      });*/

    } else {
      // aquí luego va el update
    }
  }


  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: res => {
        this.categorias = res.data;

        this.categoriasForm.clear();

        this.categorias.forEach(() => {
          this.categoriasForm.push(this.fb.control(false));
        });

        this.cdr.detectChanges();
      },
      error: err => {
        this.error = 'Error al cargar categorias';
        console.error(err);
      }
    });
  }


  get categoriasForm() {
  return this.form.get('categorias') as any;
}


  cargarColecciones() {
    
  }
}
