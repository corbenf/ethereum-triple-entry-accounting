import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/globals.service';
import {
  startOfMonth,
  endOfMonth,
  format as fd
} from 'date-fns'
import { MatDialog } from '@angular/material';
import { TransactionReceiptModalComponent } from 'src/app/transaction-receipt-modal/transaction-receipt-modal.component';
import { MongoApiService } from 'src/app/mongo-api.service';
interface IJournalEntry {
  date: Date,
  type: string,
  transaction: string,
  reference: string,
  txHash: string,
  debit: number,
  credit: number
}

interface IGeneralLederReportData {
  name: string,
  code: string,
  entries: Array<IJournalEntry>,
  debitBalance: number,
  creditBalance: number
}

@Component({
  selector: 'general-ledger-report',
  templateUrl: './general-ledger-report.component.html',
  styleUrls: ['./general-ledger-report.component.css']
})

export class GeneralLedgerReportComponent implements OnInit {
  reportData: Array<IGeneralLederReportData> = [];
  grandTotalDebits = 0;
  grandTotalCredits = 0;

  reportingPeriod = fd(new Date(), 'YYYY-MM');
  startDate = startOfMonth(this.reportingPeriod);
  endDate = endOfMonth(this.reportingPeriod);

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService,
    public dialog: MatDialog
    ) {
      this.api.getLedgerAccounts(this.gb.currentUser._id)
      .subscribe(data => {
        this.gb.userLedgerAccounts = data;
        this.buildReport();
      })
  }

  ngOnInit() {
  }

  buildReport(){
    this.gb.userLedgerAccounts.forEach(acc => {
      let lcAllAccEntries: Array<IJournalEntry> = [];
      let debitTotal = 0;
      let creditTotal = 0;
      acc.debits.forEach(dr => {
        if(new Date(dr.date) >= this.startDate && new Date(dr.date) <= this.endDate) {
          debitTotal += dr.amount
          lcAllAccEntries.push({
            date: dr.date,
            type: dr.type,
            transaction: dr.transaction,
            reference: dr.reference,
            txHash: dr.txHash,
            debit: dr.amount,
            credit: 0
          });
        }
      });
      acc.credits.forEach(cr => {
        if(new Date(cr.date) >= this.startDate && new Date(cr.date) <= this.endDate) {
          creditTotal += cr.amount
          lcAllAccEntries.push({
            date: cr.date,
            type: cr.type,
            transaction: cr.transaction,
            reference: cr.reference,
            txHash: cr.txHash,
            debit: 0,
            credit: cr.amount
          });
        }
      });
      if(lcAllAccEntries.length>0) {
        this.reportData.push({
          name: acc.accountName,
          code: acc.code,
          entries: lcAllAccEntries,
          debitBalance: debitTotal,
          creditBalance: creditTotal
        });
      }
    });
    this.reportData.forEach(acc => {
      acc.entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.grandTotalDebits += acc.debitBalance;
      this.grandTotalCredits += acc.creditBalance
    });
  }

  clearReport(){
    this.reportData = [];
    this.grandTotalDebits = 0;
    this.grandTotalCredits = 0;
  }

  openTransactionReceiptModal(_txHash){
    this.dialog.open(TransactionReceiptModalComponent, {
      width: '760px',
      height: '510px',
      data: {txHash: _txHash}
    });
  }

  reportingPeriodHandler(){
    this.startDate = startOfMonth(this.reportingPeriod);
    this.endDate = endOfMonth(this.reportingPeriod);
    this.clearReport();
    this.buildReport();
  }

}
