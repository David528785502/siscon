import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CesantesComponent } from './cesantes.component';

describe('CesantesComponent', () => {
  let component: CesantesComponent;
  let fixture: ComponentFixture<CesantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CesantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CesantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
