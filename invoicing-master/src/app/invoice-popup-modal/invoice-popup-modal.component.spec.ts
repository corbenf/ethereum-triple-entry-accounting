import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePopupModalComponent } from './invoice-popup-modal.component';

describe('InvoicePopupModalComponent', () => {
  let component: InvoicePopupModalComponent;
  let fixture: ComponentFixture<InvoicePopupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePopupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePopupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
