import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/categorias';

  constructor(private http: HttpClient) {}

  getCategorias() {
    return this.http.get<ApiResponse<Categoria[]>>(this.URL);
  }

  // Agrega métodos de crear/editar si los usas en admin, pero este es el vital para ver.
}
