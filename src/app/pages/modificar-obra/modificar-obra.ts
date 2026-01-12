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
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      idObraDigital: [{ value: null, disabled: true }],
      titulo: [''],
      descripcion: [''],
      fechaPublicacion: [''],
      idAutor: [],
      idArchivoPrincipal: [''],
      categorias: this.fb.array([]),
    });

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Cargar en el forms el id del autor
      this.idAutor = Number(params.get('idAutor'));
      this.form.patchValue({
        idAutor: this.idAutor
      });
      // Cargar categorías
      this.cargarCategorias();

      // Si estamos en modo de modificación
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idObraDigital = Number(id);
        this.cargarObra(Number(id));
        
      } else {
        this.esEdicion = false;
      }
    });
  }

  cargarObra(id: number) {
    this.obrasService.getObraPorID(id).subscribe(res => {
      this.form.patchValue(res.data);
    });
  }


  guardar() {
    this.erroresBackend = [];

    if (this.form.invalid) return;

    if (!this.esEdicion) {
      // Creación
      const raw = this.form.value;
      if(!raw.fechaPublicacion) {
        this.erroresBackend.push('Fecha de publicación inválida');
        return;
      }
      // Setear los datos en un dummy
      const payload = {
        titulo: raw.titulo,
        descripcion: raw.descripcion,
        fechaPublicacion: raw.fechaPublicacion,
        idAutor: this.idAutor!,
        idArchivoPrincipal: null,
      };
      console.log(payload);
      // Ver qué categorías se seleccionaron
      const categoriasSeleccionadas = this.form.value.categorias
      .map((checked: boolean, i: number) =>
        checked ? this.categorias[i].idCategoria : null
      )
      .filter((v: number | null) => v !== null);
      console.log(categoriasSeleccionadas)
      // Crear la obra
      this.obrasService.crearObra(payload).subscribe({
        next: () => {
          
        },
        error: err => {
          if (err.status === 400 && err.error?.errors) {
            this.erroresBackend = err.error.errors;
          } else {
            this.erroresBackend = ['Error al registrar la obra'];
          }
          this.cdr.detectChanges();
        }
      });

    } else {
      // Modificación
      const raw = this.form.value;
      if(!raw.fechaPublicacion) {
        this.erroresBackend.push('Fecha de publicación inválida');
        return;
      }
      // Setear los datos en un dummy
      const payload = {
        titulo: raw.titulo,
        descripcion: raw.descripcion,
        fechaPublicacion: raw.fechaPublicacion,
        idAutor: this.idAutor!,
        idArchivoPrincipal: null,
      };
      if(!this.idObraDigital){
        return;
      }
      this.obrasService.actualizarObra(this.idObraDigital, payload).subscribe({
        next: () => {
          this.router.navigate(['/autor/'+this.idAutor])
        },
        error: err => {
          if (err.status === 400 && err.error?.errors) {
            this.erroresBackend = err.error.errors;
          } else {
            this.erroresBackend = ['Error al registrar la obra'];
          }
          this.cdr.detectChanges();
        }
      })
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
