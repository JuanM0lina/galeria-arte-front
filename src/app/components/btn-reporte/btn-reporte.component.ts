import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-btn-reporte',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn-pixel-verde" (click)="generarReporte()">
      <span class="icono">📄</span> Generar PDF
    </button>
  `,
  styleUrl: 'btn-reporte.scss',
})
export class BtnReporteComponent {
  @Input() tipo!: 'autores' | 'categorias' | 'colecciones' | 'obras-categoria' | 'obras-coleccion';
  @Input() id?: number;

  constructor(private reportesService: ReportesService) {}

  generarReporte() {
    switch (this.tipo) {
      case 'autores':
        this.reportesService.generarReporteAutores();
        break;
      case 'categorias':
        this.reportesService.generarReporteCategorias();
        break;
      case 'colecciones':
        this.reportesService.generarReporteColecciones();
        break;
      case 'obras-categoria':
        if (this.id) this.reportesService.generarReporteObrasPorCategoria(this.id);
        break;
      case 'obras-coleccion':
        if (this.id) this.reportesService.generarReporteObrasPorColeccion(this.id);
        break;
    }
  }
}
