import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentosPensionistasComponent } from './descuentos-pensionistas.component';

describe('DescuentosPensionistasComponent', () => {
  let component: DescuentosPensionistasComponent;
  let fixture: ComponentFixture<DescuentosPensionistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescuentosPensionistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescuentosPensionistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
