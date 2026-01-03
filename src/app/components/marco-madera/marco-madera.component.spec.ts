import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcoMaderaComponent } from './marco-madera.component';

describe('MarcoMaderaComponent', () => {
  let component: MarcoMaderaComponent;
  let fixture: ComponentFixture<MarcoMaderaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcoMaderaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcoMaderaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
