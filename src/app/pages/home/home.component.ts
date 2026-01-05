import { Component } from '@angular/core';
import { MarcoMaderaComponent } from "../../components/marco-madera/marco-madera.component";
import { MarcoPapelComponent } from '../../components/marco-papel/marco-papel.component';

@Component({
  selector: 'home',
  imports: [MarcoMaderaComponent, MarcoPapelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
}
