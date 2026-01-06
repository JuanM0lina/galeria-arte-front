import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarObra } from './modificar-obra';

describe('ModificarObra', () => {
  let component: ModificarObra;
  let fixture: ComponentFixture<ModificarObra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarObra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarObra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
