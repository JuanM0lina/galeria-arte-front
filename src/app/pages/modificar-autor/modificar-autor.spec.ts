import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarAutor } from './modificar-autor';

describe('ModificarAutor', () => {
  let component: ModificarAutor;
  let fixture: ComponentFixture<ModificarAutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarAutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarAutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
