import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-delete',
  imports: [],
  templateUrl: './btn-delete.html',
  styleUrl: './btn-delete.scss',
})
export class BtnDelete {
  @Input() label = 'Aceptar';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  @Output() click = new EventEmitter<void>();
}
