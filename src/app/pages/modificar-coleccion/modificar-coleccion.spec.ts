import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarColeccion } from './modificar-coleccion';

describe('ModificarColeccion', () => {
  let component: ModificarColeccion;
  let fixture: ComponentFixture<ModificarColeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarColeccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarColeccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
