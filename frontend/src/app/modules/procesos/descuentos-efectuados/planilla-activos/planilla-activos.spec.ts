import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaActivosComponent } from './planilla-activos.component';

describe('PlanillaActivosComponent', () => {
  let component: PlanillaActivosComponent;
  let fixture: ComponentFixture<PlanillaActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanillaActivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanillaActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
