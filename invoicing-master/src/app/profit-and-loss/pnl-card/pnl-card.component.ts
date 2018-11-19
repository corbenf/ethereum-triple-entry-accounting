import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/globals.service';
import {
  startOfMonth,
  endOfMonth,
  format as fd
} from 'date-fns'
import { MongoApiService } from 'src/app/mongo-api.service';

@Component({
  selector: 'app-pnl-card',
  templateUrl: './pnl-card.component.html',
  styleUrls: ['./pnl-card.component.css']
})
export class PnlCardComponent implements OnInit {
  tradingIncome = {
    accounts: [],
    total: 0
  };
  costOfSales = {
    accounts: [],
    total: 0
  };
  operatingExpenses = {
    accounts: [],
    total: 0
  };
  netProfit;

  reportingPeriod = fd(new Date(), 'YYYY-MM');
  startDate = startOfMonth(this.reportingPeriod);
  endDate = endOfMonth(this.reportingPeriod);

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService
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
      let lcDebits = 0;
      let lcCredits = 0;
      acc.debits.forEach(dr => {
        if(new Date(dr.date)>=this.startDate && new Date(dr.date)<=this.endDate) lcDebits += dr.amount;
      });
      acc.credits.forEach(cr => {
        if(new Date(cr.date)>=this.startDate && new Date(cr.date)<=this.endDate) lcCredits += cr.amount;
      });

      if(lcDebits > 0 || lcCredits > 0){
        if(acc.subCategory=='Sales'){
          this.tradingIncome.accounts.push({
            name: acc.accountName,
            total: lcCredits - lcDebits
          })
        }
        if(acc.subCategory=='Direct Cost'){
          this.costOfSales.accounts.push({
            name: acc.accountName,
            total: lcDebits - lcCredits
          })
        }
        if(acc.subCategory=='Overhead'){
          this.operatingExpenses.accounts.push({
            name: acc.accountName,
            total: lcDebits - lcCredits
          })
        }
      }
    });
    this.tradingIncome.accounts.forEach(acc => {
      this.tradingIncome.total += acc.total
    });
    this.costOfSales.accounts.forEach(acc => {
      this.costOfSales.total += acc.total
    });
    this.operatingExpenses.accounts.forEach(acc => {
      this.operatingExpenses.total += acc.total
    });

    this.netProfit = (this.tradingIncome.total - this.costOfSales.total) - this.operatingExpenses.total
  }

  clearReport(){
    this.tradingIncome = {
      accounts: [],
      total: 0
    };
    this.costOfSales = {
      accounts: [],
      total: 0
    };
    this.operatingExpenses = {
      accounts: [],
      total: 0
    };
    this.netProfit = 0;
  }

  reportingPeriodHandler(){
    this.startDate = startOfMonth(this.reportingPeriod);
    this.endDate = endOfMonth(this.reportingPeriod);
    this.clearReport();
    this.buildReport();
  }

}
