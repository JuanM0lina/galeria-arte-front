import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcoPapelComponent } from './marco-papel.component';

describe('MarcoPapelComponent', () => {
  let component: MarcoPapelComponent;
  let fixture: ComponentFixture<MarcoPapelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcoPapelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcoPapelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
