import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentosActivosComponent } from './descuentos-activos.component';

describe('DescuentosActivosComponent', () => {
  let component: DescuentosActivosComponent;
  let fixture: ComponentFixture<DescuentosActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescuentosActivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescuentosActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
