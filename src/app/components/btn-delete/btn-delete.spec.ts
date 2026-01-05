import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDelete } from './btn-delete';

describe('BtnDelete', () => {
  let component: BtnDelete;
  let fixture: ComponentFixture<BtnDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
