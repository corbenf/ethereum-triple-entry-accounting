import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/globals.service';
import {
  isSameYear,
  isSameDay,
  addYears,
  subYears,
  format as fd
} from 'date-fns'
import { MongoApiService } from 'src/app/mongo-api.service';

@Component({
  selector: 'app-balance-sheet-card',
  templateUrl: './balance-sheet-card.component.html',
  styleUrls: ['./balance-sheet-card.component.css']
})
export class BalanceSheetCardComponent implements OnInit {
  assets = {
    bank: [{finalBalance: 0}],
    currentAsset: [{finalBalance: 0}],
    inventory: [{finalBalance: 0}],
    drBal: 0,
    crBal: 0,
    finalBalance: 0,
    ext: ''
  }
  liabilities = {
    currentLiability: [{finalBalance: 0}],
    drBal: 0,
    crBal: 0,
    finalBalance: 0,
    ext: ''
  }
  equity = {
    equity: [],
    drBal: 0,
    crBal: 0,
    finalBalance: 0,
    ext: ''
  }
  expenses = {
    overhead: [],
    directCost: [],
    drBal: 0,
    crBal: 0,
    finalBalance: 0,
    ext: ''
  }
  revenue = {
    sales: [],
    drBal: 0,
    crBal: 0,
    finalBalance: 0,
    ext: ''
  }
  netAssets = 0;
  netExt = '';
  currentYearEarnings = 0;
  cyExt = '';

  reportingPeriod = fd(new Date(), 'YYYY-MM-DD');
  currentFinacialYear = fd(this.reportingPeriod, 'YYYY').concat('-03-31');

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
    this.currentFinacialYear = fd(this.reportingPeriod, 'YYYY').concat('-03-31');
    if(new Date(this.reportingPeriod)>new Date(this.currentFinacialYear)) this.currentFinacialYear = fd(addYears(new Date(this.currentFinacialYear), 1), 'YYYY-MM-DD');

    this.sortAccounts();
    this.calcCategoryBalance(this.assets);
    this.calcCategoryBalance(this.liabilities);
    this.calcCategoryBalance(this.equity);
    this.calcCategoryBalance(this.expenses);
    this.calcCategoryBalance(this.revenue);

    this.calcSubCategoryBalance(this.assets.bank);
    this.calcSubCategoryBalance(this.assets.currentAsset);
    this.calcSubCategoryBalance(this.assets.inventory);
    this.calcSubCategoryBalance(this.liabilities.currentLiability);

    this.calcNetAssets();
    this.calcCurrentYearEarnings();
  }

  clearReport() {
    this.assets = {
      bank: [{finalBalance: 0}],
      currentAsset: [{finalBalance: 0}],
      inventory: [{finalBalance: 0}],
      drBal: 0,
      crBal: 0,
      finalBalance: 0,
      ext: ''
    }
    this.liabilities = {
      currentLiability: [{finalBalance: 0}],
      drBal: 0,
      crBal: 0,
      finalBalance: 0,
      ext: ''
    }
    this.equity = {
      equity: [],
      drBal: 0,
      crBal: 0,
      finalBalance: 0,
      ext: ''
    }
    this.expenses = {
      overhead: [],
      directCost: [],
      drBal: 0,
      crBal: 0,
      finalBalance: 0,
      ext: ''
    }
    this.revenue = {
      sales: [],
      drBal: 0,
      crBal: 0,
      finalBalance: 0,
      ext: ''
    }
    this.netAssets = 0;
    this.netExt = '';
    this.currentYearEarnings = 0;
    this.cyExt = '';
  }

  sortAccounts(){
    this.gb.userLedgerAccounts.forEach(acc => {
      let lcDebits = 0;
      let lcCredits = 0;
      let lcBalance = 0;
      let lcExt = '';

      acc.debits.forEach(dr => {
        if(
          new Date(dr.date)<=new Date(this.reportingPeriod) || 
          isSameDay(new Date(dr.date),new Date(this.reportingPeriod))
          ) lcDebits += dr.amount;
      });
      acc.credits.forEach(cr => {
        if(new Date(cr.date)<=new Date(this.reportingPeriod) || 
        isSameDay(new Date(cr.date),new Date(this.reportingPeriod))
        ) lcCredits += cr.amount;
      });

      if(lcDebits>lcCredits) {
        lcBalance = lcDebits-lcCredits
        lcExt = 'dr'
      }
      if(lcCredits>lcDebits) {
        lcBalance = lcCredits-lcDebits
        lcExt = 'cr'
      }

      let lcAcc = {
        name: acc.accountName,
        drBal: lcDebits,
        crBal: lcCredits,
        finalBalance: lcBalance,
        ext: lcExt
       }

      if(acc.category == "Assets"){
        this.assets.drBal+=lcDebits;
        this.assets.crBal+=lcCredits;
        if(acc.subCategory=='Bank') this.assets.bank.push(lcAcc);
        if(acc.subCategory=='Current Asset') this.assets.currentAsset.push(lcAcc);
        if(acc.subCategory=='Inventory') this.assets.inventory.push(lcAcc);
      };
      if(acc.category == "Liabilities"){
        this.liabilities.drBal+=lcDebits;
        this.liabilities.crBal+=lcCredits;
        if(acc.subCategory=='Current Liability') this.liabilities.currentLiability.push(lcAcc);
      }
      if(acc.category == "Equity"){
        this.equity.drBal+=lcDebits;
        this.equity.crBal+=lcCredits;
        this.equity.equity.push(lcAcc);
      }
      if(acc.category == "Expenses"){
        this.expenses.drBal+=lcDebits;
        this.expenses.crBal+=lcCredits;
        if(acc.subCategory=='Overhead') this.expenses.overhead.push(lcAcc);
        if(acc.subCategory=='Direct Cost') this.expenses.directCost.push(lcAcc);
      }
      if(acc.category == "Revenue"){
        this.revenue.drBal+=lcDebits;
        this.revenue.crBal+=lcCredits;
        this.revenue.sales.push(lcAcc);
      }
    });
  }

  calcCategoryBalance(cat) {
    if(cat.drBal>cat.crBal) {
      cat.finalBalance = cat.drBal - cat.crBal;
      cat.ext = 'dr'
    }
    if(cat.crBal>cat.drBal) {
      cat.finalBalance = cat.crBal - cat.drBal;
      cat.ext = 'cr'
    }
  }

  calcSubCategoryBalance(cat) {
    cat.forEach(acc => {
      cat[0].finalBalance += acc.finalBalance
    });
  }

  calcNetAssets() {
    let lcNetBalance = this.assets.finalBalance-this.liabilities.finalBalance;
    if(lcNetBalance>0){
      this.netAssets = lcNetBalance;
      this.netExt = 'cr'
    }
    if(lcNetBalance<0) {
      this.netAssets = -lcNetBalance;
      this.netExt = 'dr'
    }
  }

  calcCurrentYearEarnings() {
    let lcCyTradingIncome = 0;
    let lcCyCostOfSales = 0;
    let lcCyOperatingExpenses = 0;
    let lcReTradingIncome = 0;
    let lcReCostOfSales = 0;
    let lcReOperatingExpenses = 0;

    this.gb.userLedgerAccounts.forEach(acc => {
      let lcCyDebits = 0;
      let lcCyCredits = 0;
      let lcCyBalance = 0;
      let lcReDebits = 0;
      let lcReCredits = 0;
      let lcReBalance = 0;

      if(acc.category=='Revenue' || acc.category=='Expenses'){
        acc.debits.forEach(dr => {
          if(
            new Date(dr.date)>subYears(new Date(this.currentFinacialYear), 1) &&
            new Date(dr.date)<new Date(this.currentFinacialYear) &&
            new Date(dr.date)<=new Date(this.reportingPeriod) || 
            isSameDay(new Date(dr.date), new Date(this.reportingPeriod))) lcCyDebits += dr.amount
          else if (new Date(dr.date)<=new Date(this.reportingPeriod)) lcReDebits += dr.amount
        });
        acc.credits.forEach(cr => {
          if(
            new Date(cr.date)>subYears(new Date(this.currentFinacialYear), 1) &&
            new Date(cr.date)<new Date(this.currentFinacialYear) &&
            new Date(cr.date)<=new Date(this.reportingPeriod) || 
            isSameDay(new Date(cr.date), new Date(this.reportingPeriod))) lcCyCredits += cr.amount
          else if (new Date(cr.date)<=new Date(this.reportingPeriod)) lcReCredits += cr.amount
        });

        if(lcCyDebits>lcCyCredits) {
          lcCyBalance = lcCyDebits-lcCyCredits
        }
        if(lcCyCredits>lcCyDebits) {
          lcCyBalance = lcCyCredits-lcCyDebits
        }

        if(lcReDebits>lcReCredits) {
          lcReBalance = lcReDebits-lcReCredits
        }
        if(lcReCredits>lcReDebits) {
          lcReBalance = lcReCredits-lcReDebits
        }

        if(acc.subCategory=='Sales') {
          lcCyTradingIncome += lcCyBalance;
          lcReTradingIncome += lcReBalance;
        }
        if(acc.subCategory=='Overhead') {
          lcCyOperatingExpenses += lcCyBalance;
          lcReOperatingExpenses += lcReBalance;
        }
        if(acc.subCategory=='Direct Cost') {
          lcCyCostOfSales += lcCyBalance;
          lcReCostOfSales += lcReBalance;
        }

      }

    })

    this.currentYearEarnings = (lcCyTradingIncome-lcCyCostOfSales)-lcCyOperatingExpenses
    this.equity.finalBalance += (lcReTradingIncome-lcReCostOfSales)-lcReOperatingExpenses
  }

  reportingPeriodHandler(){
    this.clearReport();
    this.buildReport();
  }

}
