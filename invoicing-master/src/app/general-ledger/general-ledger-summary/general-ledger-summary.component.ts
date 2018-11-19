import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/globals.service';
import {
  startOfMonth,
  endOfMonth,
  format as fd
} from 'date-fns'
import { MongoApiService } from 'src/app/mongo-api.service';

@Component({
  selector: 'general-ledger-summary',
  templateUrl: './general-ledger-summary.component.html',
  styleUrls: ['./general-ledger-summary.component.css']
})
export class GeneralLedgerSummaryComponent implements OnInit {

  reportingPeriod = fd(new Date(), 'YYYY-MM');
  startDate = startOfMonth(this.reportingPeriod);
  endDate = endOfMonth(this.reportingPeriod);

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService
    ) {
      this.api.getLedgerAccounts(this.gb.currentUser._id)
      .subscribe(data => this.gb.userLedgerAccounts = data)
    }

  ngOnInit() {
  }

  calcAccDebits = function(_accCode){
    let i =  this.gb.userLedgerAccounts.findIndex(x => x.code === _accCode);
    let lcDebits = 0;

    this.gb.userLedgerAccounts[i].debits.forEach(dr => {
      if(new Date(dr.date) >= this.startDate && new Date(dr.date) <= this.endDate) lcDebits += dr.amount;
    });
    return lcDebits.toFixed(2);
  }

  calcAccCredits = function(_accCode){
    let i =  this.gb.userLedgerAccounts.findIndex(x => x.code === _accCode);
    let lcCredits = 0;

    this.gb.userLedgerAccounts[i].credits.forEach(cr => {
      if(new Date(cr.date) >= this.startDate && new Date(cr.date) <= this.endDate) lcCredits += cr.amount;
    });
    return lcCredits.toFixed(2);
  }

  calcAccNetMovement = function(_accCode){
    let lcDebits = parseFloat(this.calcAccDebits(_accCode));
    let lcCredits = parseFloat(this.calcAccCredits(_accCode));
    let lcNetMovement = lcDebits-lcCredits;
    if(lcCredits>lcDebits)return '(' + (-lcNetMovement).toFixed(2) + ')';
    else return lcNetMovement.toFixed(2);
  }

  calcNetTotalDebits = function(){
    let lcDebits = 0;
    this.gb.userLedgerAccounts.forEach(acc => {
      lcDebits += parseFloat(this.calcAccDebits(acc.code))
    });
    return lcDebits.toFixed(2);
  }

  calcNetTotalCredits = function(){
    let lcCredits = 0;
    this.gb.userLedgerAccounts.forEach(acc => {
      lcCredits += parseFloat(this.calcAccCredits(acc.code))
    });
    return lcCredits.toFixed(2);
  }

  calcTotalNetMovement = function(){
    let lcDebits = parseFloat(this.calcNetTotalDebits());
    let lcCredits = parseFloat(this.calcNetTotalCredits());
    let lcNetMovement = lcDebits-lcCredits;
    if(lcCredits>lcDebits)return '(' + (-lcNetMovement).toFixed(2) + ')';
    else return lcNetMovement.toFixed(2);
  }

  reportingPeriodHandler(){
    this.startDate = startOfMonth(this.reportingPeriod);
    this.endDate = endOfMonth(this.reportingPeriod);
  }

}
