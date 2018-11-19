
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceListSentComponent } from './invoice-list-sent.component';

describe('InvoiceListSentComponent', () => {
  let component: InvoiceListSentComponent;
  let fixture: ComponentFixture<InvoiceListSentComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceListSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceListSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
