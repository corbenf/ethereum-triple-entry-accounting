import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './app.material';
import { AppNavComponent } from './app-nav/app-nav.component';

import { CashFlowChartComponent } from './app-dashboard/cash-flow-chart/cash-flow-chart.component';
import { MoneyInChartComponent } from './app-dashboard/money-in-chart/money-in-chart.component';
import { MoneyOutChartComponent } from './app-dashboard/money-out-chart/money-out-chart.component';
import { InvoiceListSentComponent } from './sent-invoices/invoice-list-sent/invoice-list-sent.component';
import { InvoiceListReceivedComponent } from './received-invoices/invoice-list-received/invoice-list-received.component';
import { ChartOfAccountsTableComponent } from './chart-of-accounts/chart-of-accounts-table/chart-of-accounts-table.component';
import { InvoicePopupModalComponent } from './invoice-popup-modal/invoice-popup-modal.component';
import { GeneralLedgerSummaryComponent } from './general-ledger/general-ledger-summary/general-ledger-summary.component';
import { GeneralLedgerReportComponent } from './general-ledger/general-ledger-report/general-ledger-report.component';
import { PnlCardComponent } from './profit-and-loss/pnl-card/pnl-card.component';
import { BalanceSheetCardComponent } from './balance-sheet/balance-sheet-card/balance-sheet-card.component';
import { TransactionReceiptModalComponent } from './transaction-receipt-modal/transaction-receipt-modal.component';
import { InventoryTableComponent } from './inventory/inventory-table/inventory-table.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    AppNavComponent,
    CashFlowChartComponent,
    MoneyInChartComponent,
    MoneyOutChartComponent,
    InvoiceListSentComponent,
    InvoiceListReceivedComponent,
    ChartOfAccountsTableComponent,
    InvoicePopupModalComponent,
    GeneralLedgerSummaryComponent,
    GeneralLedgerReportComponent,
    PnlCardComponent,
    BalanceSheetCardComponent,
    TransactionReceiptModalComponent,
    InventoryTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
  ],
  entryComponents: [
    MoneyInChartComponent, 
    MoneyOutChartComponent, 
    CashFlowChartComponent,
    InvoicePopupModalComponent,
    TransactionReceiptModalComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
