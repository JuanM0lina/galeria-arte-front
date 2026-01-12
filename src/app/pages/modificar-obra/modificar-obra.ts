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
import { forkJoin, switchMap, of, map } from 'rxjs';
import { ArchivoDigitalService } from '../../services/archivo-digital.service';
import { ArchivoDigital } from '../../models/archivo-digital.model';

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
  obradigital?: ObraDigital;

  // archivo
  archivoEliminado = false;
  archivoActual?: ArchivoDigital;
  archivoSeleccionado?: File;
  previewUrl?: string;
  esImagenSeleccionada = false;

  constructor(
    private categoriasService: CategoriasService,
    private obrasService: ObrasDigitalesService,
    private obraCategoriaService: ObraCategoriaService,
    private archivoDigitalService: ArchivoDigitalService,
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
    this.obrasService.getObraPorID(id).subscribe({
      next: res => {
        this.obradigital = res.data;
        
        this.form.patchValue({
          idObraDigital: this.obradigital.idObraDigital,
          titulo: this.obradigital.titulo,
          descripcion: this.obradigital.descripcion,
          fechaPublicacion: this.obradigital.fechaPublicacion,
          idArchivoPrincipal: this.obradigital.idArchivoPrincipal
        });
        console.log(this.obradigital)
        // Cargar archivo
        if (this.obradigital.idArchivoPrincipal) {
          this.cargarArchivo(this.obradigital.idArchivoPrincipal);
        }

        this.cdr.detectChanges();
      }
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
        return this.obraCategoriaService.getCategoriasPorIdObra(idObra);
      })
    ).subscribe({
      next: (res: any) => {
        const idsCategorias: number[] = res.data.map(
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

  cargarArchivo(idArchivo: number) {
    this.archivoDigitalService.getArchivoPorId(idArchivo).subscribe({
      next: res => {
        this.archivoActual = res.data;
        console.log("archivoactual", this.archivoActual);
        this.esImagenSeleccionada =
          this.archivoActual.formato.startsWith('image/');

        if (this.esImagenSeleccionada) {
          this.previewUrl = this.getRutaArchivo(this.archivoActual.ruta);
        }

        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error cargando archivo digital', err);
      }
    });
  }

  getRutaArchivo(ruta: string): string {
    return ruta.replace('./', '/');
  }
  
  get categoriasForm(): FormArray {
    return this.form.get('categorias') as FormArray;
  }

  cargarCategoriasDeObra(id: number) {
    this.obraCategoriaService.getCategoriasPorIdObra(id).subscribe(res => {
      const obraCategorias = res.data as unknown as ObraCategoria[];

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
    const raw = this.form.value;
    if(!raw.fechaPublicacion) {
      this.erroresBackend.push('Fecha de publicación inválida');
      return;
    }
    if(!raw.titulo) {
      this.erroresBackend.push('Es necesario un título');
      return;
    }
    // Creación
    if (!this.esEdicion) {
      if(!this.archivoSeleccionado) {
        this.erroresBackend.push('No hay archivo seleccionado');
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
          if (!obra) throw new Error('No se creó la obra');

          const idObra = obra.idObraDigital;
          console.log('se creó obra', idObra);
          // Categorías
          const categorias$ = categoriasSeleccionadas.length
            ? forkJoin(
                categoriasSeleccionadas.map((idCategoria: number) =>
                  this.obraCategoriaService.crearObraCategoria({
                    idObraDigital: idObra,
                    idCategoria
                  })
                )
              )
            : of(null);
          
          return categorias$.pipe(map(() => obra));
        }),

        switchMap(async obra => {
          console.log('segundo map', obra);
          if (!this.archivoSeleccionado) return { obra, archivo: null };
          
          const checksum = await this.calcularChecksum(this.archivoSeleccionado);
          
          return this.archivoDigitalService.crearArchivoDigital({
            ruta: `./archivos/${this.archivoSeleccionado.name}`,
            formato: this.archivoSeleccionado.type,
            checksum,
            idObraDigital: obra.idObraDigital
          }).pipe(
            map(res => ({ obra, archivo: res.data }))
          ).toPromise();
        }),

        switchMap((result) => {
          if (!result || !result.obra) return of(null);

          const { obra, archivo } = result;
          if (!archivo) return of(null);

          console.log('Archivo creado:', archivo);

          return this.obrasService.actualizarObra(obra.idObraDigital, {
            ...payload,
            idArchivoPrincipal: archivo.idArchivo
          });
        })
      ).subscribe({
        next: () => {
          //this.router.navigate(['/autor/'+this.idAutor])
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

    // Modificación
    } else {
      const raw = this.form.value;
      if(!raw.fechaPublicacion) {
        this.erroresBackend.push('Fecha de publicación inválida');
        return;
      }
      if (this.esEdicion && this.archivoEliminado && !this.archivoSeleccionado) {
        this.erroresBackend.push(
          'Debes seleccionar un nuevo archivo después de eliminar el actual'
        );
        return;
      }
      // Setear los datos en un dummy
      const payload = {
        titulo: raw.titulo,
        descripcion: raw.descripcion,
        fechaPublicacion: raw.fechaPublicacion,
        idAutor: this.idAutor!,
        idArchivoPrincipal: this.obradigital?.idArchivoPrincipal ?? null,
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
        }),
        switchMap(async () => {
          // Caso A: no se tocó archivo
          if (!this.archivoEliminado) {
            console.log('no se toco el archivo')
            return null;
          }
          // Caso B: se eliminó y se subió nuevo
          console.log("this.archivoSeleccionado", this.archivoSeleccionado)
          console.log("this.archivoActual?.idArchivo", this.archivoActual)
          if (this.archivoSeleccionado && this.archivoActual?.idArchivo) {
            const checksum = await this.calcularChecksum(this.archivoSeleccionado);
            console.log('se modificará el archivo');

            return this.archivoDigitalService.actualizarArchivoDigital(this.archivoActual.idArchivo, {
              ruta: `./archivos/${this.archivoSeleccionado.name}`,
              formato: this.archivoSeleccionado.type,
              checksum,
              idObraDigital: this.idObraDigital!
            }).toPromise();
          }
          return null;
        }),
        switchMap(res => {
          if (!res?.data) return of(null);

          return this.obrasService.actualizarObra(this.idObraDigital!, {
            ...payload,
          });
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

  // ---- Archivos ----
  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.archivoSeleccionado = undefined;
      return
    };

    this.archivoSeleccionado = input.files[0];

    this.esImagenSeleccionada = this.archivoSeleccionado.type.startsWith('image/');

    if (this.esImagenSeleccionada) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.archivoSeleccionado);
    } else {
      this.previewUrl = undefined;
    }
  }

  async calcularChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  eliminarArchivoActual() {
    this.archivoEliminado = true;
    this.archivoSeleccionado = undefined;
    this.previewUrl = undefined;
    this.esImagenSeleccionada = false;
    this.cdr.detectChanges();
  }
}
