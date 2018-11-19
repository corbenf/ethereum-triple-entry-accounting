import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentInvoicesComponent } from './sent-invoices.component';

describe('SentInvoicesComponent', () => {
  let component: SentInvoicesComponent;
  let fixture: ComponentFixture<SentInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
