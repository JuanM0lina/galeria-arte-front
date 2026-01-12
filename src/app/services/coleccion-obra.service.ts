import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { ColeccionObra } from '../models/coleccion-obra.model';
import { Coleccion } from '../models/coleccion.model';
import { ObraDigital } from '../models/obra-digital.model';

export interface CrearColeccionObraDTO {
  idObraDigital: number;
  idColeccion: number;
}

@Injectable({ providedIn: 'root' })
export class ColeccionObraService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/coleccion-obra';

  constructor(private http: HttpClient) {}

  crearObraCategoria(datos: CrearColeccionObraDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getcoleccionObraPorId(id: number) {
    return this.http.get<ApiResponse<ColeccionObra>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  eliminarColeccionObra(id: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getColeccionPorIdObra(idObra: number) {
    return this.http.get<ApiResponse<Coleccion>>(
      `${this.URL}/obra/${idObra}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getObrasDeColeccion(idColeccion: number) {
    return this.http.get<ApiResponse<ObraDigital[]>>(
      `${this.URL}/coleccion/${idColeccion}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  eliminarObraCategoriaPorIds(idColeccion: number, idObra: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.URL}/coleccion/${idColeccion}/obra/${idObra}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}
