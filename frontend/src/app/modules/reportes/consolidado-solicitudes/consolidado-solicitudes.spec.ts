import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidadoSolicitudesComponent } from './consolidado-solicitudes.component';

describe('ConsolidadoSolicitudesComponent', () => {
  let component: ConsolidadoSolicitudesComponent;
  let fixture: ComponentFixture<ConsolidadoSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolidadoSolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidadoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
