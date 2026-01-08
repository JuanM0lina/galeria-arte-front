import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Categoria } from '../models/categoria.model';

export interface CrearCategoriaDTO {
  nombreCategoria: string;
  descripcionCategoria: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriasService {

  private readonly URL = 'http://localhost:8082/api/categorias';
  //private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/categorias';

  constructor(private http: HttpClient) {}

  getCategoriaPorId(id: number) {
    return this.http.get<ApiResponse<Categoria>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  actualizarCategoria(idCategoria: number, datos: CrearCategoriaDTO) {
    return this.http.put<ApiResponse<null>>(
      `${this.URL}/${idCategoria}`,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    )
  }

  eliminarCategoria(id: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getCategorias() {
    return this.http.get<ApiResponse<Categoria[]>>(
      this.URL,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  crearCategoria(datos: CrearCategoriaDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    )
  }

}
