
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceListReceivedComponent } from './invoice-list-received.component';

describe('InvoiceListReceivedComponent', () => {
  let component: InvoiceListReceivedComponent;
  let fixture: ComponentFixture<InvoiceListReceivedComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceListReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceListReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
