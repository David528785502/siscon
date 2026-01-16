import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaCesantesComponent } from './planilla-cesantes.component';

describe('PlanillaCesantesComponent', () => {
  let component: PlanillaCesantesComponent;
  let fixture: ComponentFixture<PlanillaCesantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanillaCesantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanillaCesantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
