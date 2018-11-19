import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerReportComponent } from './general-ledger-report.component';

describe('GeneralLedgerReportComponent', () => {
  let component: GeneralLedgerReportComponent;
  let fixture: ComponentFixture<GeneralLedgerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLedgerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
