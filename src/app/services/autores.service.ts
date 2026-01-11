import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Autor } from '../models/autor.model';

export interface CrearAutorDTO {
  nombreCompleto: string,
  correoContacto: string,
  avatar: string,
}

@Injectable({ providedIn: 'root' })
export class AutoresService {

  //private readonly URL = 'http://localhost:8082/api/autores';
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/autores';

  constructor(private http: HttpClient) {}

  getAutorPorId(id: number) {
    return this.http.get<ApiResponse<Autor>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  actualizarAutor(idAutor: number, datos: CrearAutorDTO) {
    return this.http.put<ApiResponse<null>>(
      `${this.URL}/${idAutor}`,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    )
  }

  eliminarAutor(id: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  getAutores() {
    return this.http.get<ApiResponse<Autor[]>>(
      this.URL,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  crearAutor(datos: CrearAutorDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    )
  }

}
