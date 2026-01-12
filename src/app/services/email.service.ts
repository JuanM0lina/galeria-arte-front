import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';

export interface correoDTO {
  destinatario: string,
  asunto: string,
  contenido: string,
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/email';

  constructor(private http: HttpClient) {}

  enviarEmail(datos: correoDTO) {
    return this.http.post<ApiResponse<null>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  notificarObra(destinatario: string, tituloObra: string, nombreAutor: string) {
    const body = { destinatario, tituloObra, nombreAutor };
    return this.http.post<ApiResponse<null>>(
      `${this.URL}/notificar-obra`,
      body
    );
  }

  notificarColeccion(destinatario: string, nombreColeccion: string) {
    const body = { destinatario, nombreColeccion };
    return this.http.post<ApiResponse<null>>(
      `${this.URL}/notificar-coleccion`,
      body
    );
  }
}