import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnlCardComponent } from './pnl-card.component';

describe('PnlCardComponent', () => {
  let component: PnlCardComponent;
  let fixture: ComponentFixture<PnlCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnlCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnlCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
