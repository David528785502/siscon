import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarDesembolsosComponent } from './actualizar-desembolsos.component';

describe('ActualizarDesembolsosComponent', () => {
  let component: ActualizarDesembolsosComponent;
  let fixture: ComponentFixture<ActualizarDesembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualizarDesembolsosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarDesembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
