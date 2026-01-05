import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ObraDigital } from '../models/obra-digital.model';

@Injectable({ providedIn: 'root' })
export class ObrasDigitalesService {

  private readonly URL = 'http://localhost:8082/api/obras';

  constructor(private http: HttpClient) {}
/*
  getAutores() {
    return this.http.get<ApiResponse<Autor[]>>(
      this.URL,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }
*/
  getObrasPorIdAutor(idAutor: number) {
    return this.http.get<ApiResponse<ObraDigital[]>>(
      `${this.URL}/autor/${idAutor}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
  }

}
