import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly URL = 'https://galeriaarte-gujm.onrender.com/api/reportes';

  constructor(private http: HttpClient) {}

  private descargarPDF(url: string, nombreArchivo: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlBlob);
      },
      error: (err) => console.error('Error descargando reporte', err),
    });
  }

  generarReporteAutores() {
    this.descargarPDF(`${this.URL}/autores`, 'Reporte_Autores.pdf');
  }

  generarReporteCategorias() {
    this.descargarPDF(`${this.URL}/categorias`, 'Reporte_Categorias.pdf');
  }

  generarReporteColecciones() {
    this.descargarPDF(`${this.URL}/colecciones`, 'Reporte_Colecciones.pdf');
  }

  generarReporteObrasPorCategoria(id: number) {
    this.descargarPDF(`${this.URL}/obras/categoria/${id}`, `Reporte_Obras_Cat_${id}.pdf`);
  }

  generarReporteObrasPorColeccion(id: number) {
    this.descargarPDF(`${this.URL}/obras/coleccion/${id}`, `Reporte_Obras_Col_${id}.pdf`);
  }
}
