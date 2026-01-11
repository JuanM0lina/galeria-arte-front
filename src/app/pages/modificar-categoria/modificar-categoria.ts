import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BtnPrimary } from '../../components/btn-primary/btn-primary';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-modificar-categoria',
  imports: [
    ReactiveFormsModule,
    MarcoMaderaComponent,
    NgIf,
    NgFor,
    BtnPrimary,
  ],
  templateUrl: './modificar-categoria.html',
  styleUrl: './modificar-categoria.scss',
})
export class ModificarCategoria implements OnInit {
  
  esEdicion = false;
  categoriaId?: number;
  form: any;
  datos: object = {};
  erroresBackend: string[] = [];

  constructor(
    private categoriasService: CategoriasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      idCategoria: [{ value: null, disabled: true }],
      nombreCategoria: [''],
      descripcionCategoria: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.esEdicion = true;
        this.categoriaId = Number(id);
        this.cargarCategoria(this.categoriaId);
      } else {
        this.esEdicion = false;
        this.form.reset();
      }
    });
  }

  cargarCategoria(id: number) {
    this.categoriasService.getCategoriaPorId(id).subscribe(res => {
      this.form.patchValue(res.data);
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.erroresBackend = ['Formulario inválido'];
      this.cdr.detectChanges();
      return;
    }
    this.erroresBackend = [];

    if (this.esEdicion) {
      this.categoriasService.actualizarCategoria(this.categoriaId!, this.form.value).subscribe({
        next: () => {
          //this.router.navigate(['/categoria/'+this.categoriaId])
          this.router.navigate(['/categorias']);
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
      this.categoriasService.crearCategoria(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/categorias']);
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
