import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { MoneyInChartComponent } from './money-in-chart/money-in-chart.component';
import { MoneyOutChartComponent } from './money-out-chart/money-out-chart.component';
import { CashFlowChartComponent } from './cash-flow-chart/cash-flow-chart.component';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css']
})
export class AppDashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Invoices Receivable', cols: 2, rows: 7, component: MoneyInChartComponent },
          { title: 'Bills Payable', cols: 2, rows: 7, component: MoneyOutChartComponent },
          { title: 'Money In and Out', cols: 2, rows: 7, component: CashFlowChartComponent }
        ];
      }
      return [
        { title: 'Invoices Receivable', cols: 1, rows: 9, component: MoneyInChartComponent },
        { title: 'Bills Payable', cols: 1, rows: 9, component: MoneyOutChartComponent },
        { title: 'Money In and Out', cols: 1, rows: 9, component: CashFlowChartComponent }
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private gb: GlobalsService
    ) {
  }
}
