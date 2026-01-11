import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCategoria } from './modificar-categoria';

describe('ModificarCategoria', () => {
  let component: ModificarCategoria;
  let fixture: ComponentFixture<ModificarCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
