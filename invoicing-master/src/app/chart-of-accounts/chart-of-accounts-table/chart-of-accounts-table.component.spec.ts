
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountsTableComponent } from './chart-of-accounts-table.component';

describe('ChartOfAccountsTableComponent', () => {
  let component: ChartOfAccountsTableComponent;
  let fixture: ComponentFixture<ChartOfAccountsTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccountsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
