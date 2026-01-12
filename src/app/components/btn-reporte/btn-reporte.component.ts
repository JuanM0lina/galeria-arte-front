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
  styles: [`
    .btn-pixel-verde {
      background: #4CAF50;
      border: 3px solid #1B5E20;
      color: white;
      padding: 8px 12px;
      font-family: inherit;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
      image-rendering: pixelated; /* Para el borde nítido */
    }

    .btn-pixel-verde:hover {
      background: #66BB6A;
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
    }

    .btn-pixel-verde:active {
      transform: translate(0, 0);
      box-shadow: 2px 2px 0px rgba(0,0,0,0.3);
    }

    .icono {
      font-size: 1.2rem;
    }
  `]
})
export class BtnReporteComponent {
  @Input() tipo!: 'categorias' | 'colecciones' | 'obras-categoria' | 'obras-coleccion';
  @Input() id?: number;

  constructor(private reportesService: ReportesService) {}

  generarReporte() {
    switch (this.tipo) {
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
