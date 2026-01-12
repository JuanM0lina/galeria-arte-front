import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { ArchivoDigital } from '../models/archivo-digital.model';

export interface CrearArchivoDigitalDTO {
  ruta: string;
  formato: string;
  checksum: string;
  idObraDigital: number;
}

@Injectable({ providedIn: 'root' })
export class ArchivoDigitalService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/archivos';

  constructor(
    private http: HttpClient
  ) {}

  crearArchivoDigital(datos: CrearArchivoDigitalDTO) {
    return this.http.post<ApiResponse<ArchivoDigital>>(
      this.URL,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

  actualizarArchivoDigital(idArchivo: number, datos: CrearArchivoDigitalDTO) {
    return this.http.put<ApiResponse<null>>(
      `${this.URL}/${idArchivo}`,
      datos,
      { headers: { 'Cache-Control': 'no-cache' } }
    )
  }

  getArchivoPorId(id: number) {
    return this.http.get<ApiResponse<ArchivoDigital>>(
      `${this.URL}/${id}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}
