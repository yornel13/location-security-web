import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicercohistorialComponent } from './vehicercohistorial.component';

describe('VehicercohistorialComponent', () => {
  let component: VehicercohistorialComponent;
  let fixture: ComponentFixture<VehicercohistorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicercohistorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicercohistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
