import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { MarcoMaderaComponent } from '../../components/marco-madera/marco-madera.component';
import { BtnPrimary } from "../../components/btn-primary/btn-primary";
import { NgIf, NgFor } from '@angular/common';
import { Categoria } from '../../models/categoria.model';
import { CategoriasService } from '../../services/categorias.service';
import { ObraDigital } from '../../models/obra-digital.model';
import { ObrasDigitalesService } from '../../services/obras.service';
import { ObraCategoria } from '../../models/obra-categoria.model';
import { ObraCategoriaService } from '../../services/obra-categoria.service';
import { forkJoin, switchMap, of } from 'rxjs';

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
  categoriasOriginales: number[] = [];

  constructor(
    private categoriasService: CategoriasService,
    private obrasService: ObrasDigitalesService,
    private obraCategoriaService: ObraCategoriaService,
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
      this.idAutor = Number(params.get('idAutor'));
      this.form.patchValue({ idAutor: this.idAutor });

      const id_ = params.get('id');

      if (id_) {
        this.esEdicion = true;
        this.idObraDigital = Number(id_);

        this.cargarObra(this.idObraDigital);

        this.cargarCategoriasYSeleccionadas(this.idObraDigital);

      } else {
        this.esEdicion = false;
        this.cargarCategorias();
      }
    });
  }

  cargarObra(id: number) {
    this.obrasService.getObraPorID(id).subscribe(res => {
      this.form.patchValue(res.data);
    });
  }
  
  cargarCategoriasYSeleccionadas(idObra: number) {
    this.categoriasService.getCategorias().pipe(
      switchMap(res => {
        console.log("categorías", res.data);
        this.categorias = res.data;

        // construir FormArray
        this.categoriasForm.clear();
        this.categorias.forEach(() => {
          this.categoriasForm.push(this.fb.control(false));
        });

        this.cdr.detectChanges();
        // ahora cargar categorías de la obra
        return this.obraCategoriaService.getObraCategoriaPorIdObra(idObra);
      })
    ).subscribe({
      next: res => {
        const idsCategorias = res.data.map(
          (oc: ObraCategoria) => oc.idCategoria
        );

        this.marcarCategoriasSeleccionadas(idsCategorias);
      },
      error: err => {
        console.error('Error cargando categorías', err);
        this.error = 'Error al cargar categorías';
      }
    });
  }

  cargarCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: res => {
        console.log("categorías", res.data);
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

  get categoriasForm(): FormArray {
    return this.form.get('categorias') as FormArray;
  }

  cargarCategoriasDeObra(id: number) {
    this.obraCategoriaService.getObraCategoriaPorIdObra(id).subscribe(res => {
      const obraCategorias = res.data as ObraCategoria[];

      this.categoriasOriginales = obraCategorias.map(oc => oc.idCategoria);

      // marcar checkboxes
      obraCategorias.forEach(oc => {
        const index = this.categorias.findIndex(c => c.idCategoria === oc.idCategoria);
        if (index !== -1) {
          this.categoriasForm.at(index).setValue(true);
        }
      });

      this.cdr.detectChanges();
    });
  }


  private marcarCategoriasSeleccionadas(idsCategorias: number[]) {
    this.categorias.forEach((cat, index) => {
      if (idsCategorias.includes(cat.idCategoria)) {
        this.categoriasForm.at(index).setValue(true);
      }
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
      console.log(categoriasSeleccionadas);

      // Crear la obra
      this.obrasService.crearObra(payload).pipe(
        switchMap(res => {
          const obra = res.data as unknown as ObraDigital;
          if (!obra) {
            throw new Error('Error: No se pudo crear la obra');
          }
          const idObra = obra.idObraDigital;

          if (!categoriasSeleccionadas.length) {
            return of(null);
          }
          // Crear requests ObraCategoria
          const requests = categoriasSeleccionadas.map((idCategoria: any) =>
            this.obraCategoriaService.crearObraCategoria({
              idObraDigital: idObra,
              idCategoria
            })
          );
          return forkJoin(requests);
        })
      ).subscribe({
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

      // Ver qué categorías se seleccionaron
      const categoriasSeleccionadas = this.form.value.categorias
      .map((checked: boolean, i: number) =>
        checked ? this.categorias[i].idCategoria : null
      )
      .filter((v: number | null) => v !== null);
      console.log(categoriasSeleccionadas);

      const categoriasAAgregar = categoriasSeleccionadas.filter(
        (id: number) => !this.categoriasOriginales.includes(id)
      );

      const categoriasAEliminar = this.categoriasOriginales.filter(
        (id: number) => !categoriasSeleccionadas.includes(id)
      );

      
      if(!this.idObraDigital){
        return;
      }
      this.obrasService.actualizarObra(this.idObraDigital, payload).pipe(
        switchMap(() => {
          const creates$ = categoriasAAgregar.map((idCat: number) =>
            this.obraCategoriaService.crearObraCategoria({
              idObraDigital: this.idObraDigital!,
              idCategoria: idCat
            })
          );

          const deletes$ = categoriasAEliminar.map(idCat =>
            this.obraCategoriaService.eliminarObraCategoriaPorIds(
              this.idObraDigital!,
              idCat
            )
          );

          return forkJoin([...creates$, ...deletes$].length
            ? [...creates$, ...deletes$]
            : of(null)
          );
        })
      ).subscribe({
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


  



  cargarColecciones() {
    
  }
}
