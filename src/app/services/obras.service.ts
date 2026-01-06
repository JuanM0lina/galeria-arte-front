import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ObraDigital } from '../models/obra-digital.model';

export interface CrearObrasDTO {
  titulo: string;
  descripcion: string;
  fechaPublicacion: Date;
  idAutor: number;
  idArchivoPrincipal: number | null;
}

@Injectable({ providedIn: 'root' })
export class ObrasDigitalesService {

  private readonly URL = 'http://localhost:8082/api/obras';

  constructor(private http: HttpClient) {}

  getObrasPorIdAutor(idAutor: number) {
    return this.http.get<ApiResponse<ObraDigital[]>>(
      `${this.URL}/autor/${idAutor}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  crearObra(datos: CrearObrasDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    )
  }

}
