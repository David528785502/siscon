import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesPrestamosComponent } from './solicitudes-prestamos.component';

describe('SolicitudesPrestamosComponent', () => {
  let component: SolicitudesPrestamosComponent;
  let fixture: ComponentFixture<SolicitudesPrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudesPrestamosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
