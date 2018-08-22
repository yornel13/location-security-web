import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportetsComponent } from './reportets.component';

describe('ReportetsComponent', () => {
  let component: ReportetsComponent;
  let fixture: ComponentFixture<ReportetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
