import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-primary',
  imports: [],
  templateUrl: './btn-primary.html',
  styleUrl: './btn-primary.scss',
})
export class BtnPrimary {
  @Input() label = 'Aceptar';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  @Output() click = new EventEmitter<void>();

  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.click.emit();
  }
}
