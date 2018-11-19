import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedInvoicesComponent } from './received-invoices.component';

describe('ReceivedInvoicesComponent', () => {
  let component: ReceivedInvoicesComponent;
  let fixture: ComponentFixture<ReceivedInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
