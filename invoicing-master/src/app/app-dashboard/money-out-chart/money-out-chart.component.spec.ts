import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyOutChartComponent } from './money-out-chart.component';

describe('MoneyOutChartComponent', () => {
  let component: MoneyOutChartComponent;
  let fixture: ComponentFixture<MoneyOutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyOutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyOutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
