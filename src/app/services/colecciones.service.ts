import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { Coleccion } from '../models/coleccion.model';

@Injectable({ providedIn: 'root' })
export class ColeccionesService {

  private readonly URL = 'http://localhost:8082/api/colecciones';
  //private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/colecciones';

  constructor(private http: HttpClient) {}

  getColecciones() {
    return this.http.get<ApiResponse<Coleccion[]>>(
      this.URL,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }
}
