import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabhistorialComponent } from './tabhistorial.component';

describe('TabhistorialComponent', () => {
  let component: TabhistorialComponent;
  let fixture: ComponentFixture<TabhistorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabhistorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabhistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
