import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowChartComponent } from './cash-flow-chart.component';

describe('CashFlowChartComponent', () => {
  let component: CashFlowChartComponent;
  let fixture: ComponentFixture<CashFlowChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFlowChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
