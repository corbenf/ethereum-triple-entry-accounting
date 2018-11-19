import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyInChartComponent } from './money-in-chart.component';

describe('MoneyInChartComponent', () => {
  let component: MoneyInChartComponent;
  let fixture: ComponentFixture<MoneyInChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyInChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyInChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
