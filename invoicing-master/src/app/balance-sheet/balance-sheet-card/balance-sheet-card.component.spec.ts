import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetCardComponent } from './balance-sheet-card.component';

describe('BalanceSheetCardComponent', () => {
  let component: BalanceSheetCardComponent;
  let fixture: ComponentFixture<BalanceSheetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSheetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSheetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
