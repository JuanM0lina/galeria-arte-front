import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { ObraDigital } from '../models/obra-digital.model';

export interface CrearObrasDTO {
  titulo: string;
  descripcion: string;
  fechaPublicacion: string;
  idAutor: number;
  idArchivoPrincipal: number | null;
}

@Injectable({ providedIn: 'root' })
export class ObrasDigitalesService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/obras';

  constructor(private http: HttpClient) {}

  getObraPorID(id: number) {
    return this.http.get<ApiResponse<ObraDigital>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  actualizarObra(id: number, datos: CrearObrasDTO) {
    return this.http.put<ApiResponse<null>>(
      `${this.URL}/${id}`,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }


  getObras() {
    return this.http.get<ApiResponse<ObraDigital[]>>(this.URL);
  }

  getObrasPorIdAutor(idAutor: number) {
    return this.http.get<ApiResponse<ObraDigital[]>>(`${this.URL}/autor/${idAutor}`);
  }

  crearObra(datos: CrearObrasDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}
