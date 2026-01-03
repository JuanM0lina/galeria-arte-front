import { Component } from '@angular/core';
import { MarcoMaderaComponent } from "../../components/marco-madera/marco-madera.component";
import { MarcoPapelComponent } from "../../components/marco-papel/marco-papel.component";

@Component({
  selector: 'app-autor',
  imports: [MarcoMaderaComponent, MarcoPapelComponent],
  templateUrl: './autor.html',
  styleUrl: './autor.scss',
})
export class Autor {

}
