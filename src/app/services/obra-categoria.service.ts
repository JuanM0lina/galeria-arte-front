import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { ObraCategoria } from '../models/obra-categoria.model';

export interface CrearObraCategoriaDTO {
  idObraDigital: number;
  idCategoria: number;
}

@Injectable({ providedIn: 'root' })
export class ObraCategoriaService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/obra-categoria';

  constructor(private http: HttpClient) {}

  crearObraCategoria(datos: CrearObraCategoriaDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getObraCategoriaPorId(id: number) {
    return this.http.get<ApiResponse<ObraCategoria>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  eliminarObraCategoria(id: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getObraCategoriaPorIdCategoria(idCat: number) {
    return this.http.get<ApiResponse<ObraCategoria[]>>(
      `${this.URL}/categoria/${idCat}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getObraCategoriaPorIdObra(idObra: number) {
    return this.http.get<ApiResponse<ObraCategoria[]>>(
      `${this.URL}/obra/${idObra}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  eliminarObraCategoriaPorIds(idObra: number, idCat: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.URL}/obra/${idObra}/categoria/${idCat}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}
