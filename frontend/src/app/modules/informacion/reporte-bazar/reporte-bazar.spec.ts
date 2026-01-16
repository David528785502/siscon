import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteBazarComponent } from './reporte-bazar.component';

describe('ReporteBazarComponent', () => {
  let component: ReporteBazarComponent;
  let fixture: ComponentFixture<ReporteBazarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteBazarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteBazarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
