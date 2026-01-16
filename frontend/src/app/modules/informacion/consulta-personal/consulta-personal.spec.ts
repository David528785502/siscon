import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPersonalComponent } from './consulta-personal.component';

describe('ConsultaPersonalComponent', () => {
  let component: ConsultaPersonalComponent;
  let fixture: ComponentFixture<ConsultaPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultaPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
