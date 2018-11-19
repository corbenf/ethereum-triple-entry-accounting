import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerSummaryComponent } from './general-ledger-summary.component';

describe('GeneralLedgerSummaryComponent', () => {
  let component: GeneralLedgerSummaryComponent;
  let fixture: ComponentFixture<GeneralLedgerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLedgerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
