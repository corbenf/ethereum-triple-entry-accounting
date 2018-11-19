import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReceiptModalComponent } from './transaction-receipt-modal.component';

describe('TransactionReceiptModalComponent', () => {
  let component: TransactionReceiptModalComponent;
  let fixture: ComponentFixture<TransactionReceiptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionReceiptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReceiptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
