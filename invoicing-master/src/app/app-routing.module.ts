import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { AppDashboardComponent } from './app-dashboard/app-dashboard.component'
import { NewSalesInvoiceComponent } from './new-sales-invoice/new-sales-invoice.component';
import { SentInvoicesComponent } from './sent-invoices/sent-invoices.component';
import { ReceivedInvoicesComponent } from './received-invoices/received-invoices.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { GeneralLedgerComponent } from './general-ledger/general-ledger.component';
import { ProfitAndLossComponent } from './profit-and-loss/profit-and-loss.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { InventoryComponent } from './inventory/inventory.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: AppDashboardComponent},
  {path: 'new-invoice', component: NewSalesInvoiceComponent},
  {path: 'sent-invoices', component: SentInvoicesComponent},
  {path: 'received-invoices', component: ReceivedInvoicesComponent},
  {path: 'chart-of-accounts', component: ChartOfAccountsComponent},
  {path: 'general-ledger', component: GeneralLedgerComponent},
  {path: 'profit-and-loss', component: ProfitAndLossComponent},
  {path: 'balance-sheet', component: BalanceSheetComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: '**', component: PageNotFoundComponent} //Research best practice for default routes
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

// Research exporting from routing component vs importing directly in app.module
export const routingComponents = [
  PageNotFoundComponent,
  AppDashboardComponent,
  NewSalesInvoiceComponent,
  SentInvoicesComponent,
  ReceivedInvoicesComponent,
  ChartOfAccountsComponent,
  GeneralLedgerComponent,
  ProfitAndLossComponent,
  BalanceSheetComponent,
  InventoryComponent,
]