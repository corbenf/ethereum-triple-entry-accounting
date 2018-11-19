import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { GlobalsService } from '../../globals.service';
import { MongoApiService } from '../../mongo-api.service';

@Component({
  selector: 'chart-of-accounts-table',
  templateUrl: './chart-of-accounts-table.component.html',
  styleUrls: ['./chart-of-accounts-table.component.css']
})
export class ChartOfAccountsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['code', 'name', 'subCategory', 'ytd'];

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService){
    this.dataSource = new MatTableDataSource(this.gb.userLedgerAccounts);
    this.api.getLedgerAccounts(this.gb.currentUser._id)
      .subscribe(data => this.gb.userLedgerAccounts = data)
  }

  ngOnInit() {
  }

  calcYTD(_accCode){
    var i = this.gb.userLedgerAccounts.findIndex(x => x.code === _accCode)
    let debits = 0
    let credits = 0
    this.gb.userLedgerAccounts[i].debits.forEach(dr => {
      debits += dr.amount
    });
    this.gb.userLedgerAccounts[i].credits.forEach(cr => {
      credits += cr.amount
    });
    if(debits > credits) return (debits-credits).toFixed(2) + ' dr';
    else if(credits > debits) return (credits-debits).toFixed(2) + ' cr';
    else if(debits == credits) return (0);
  }

  applyFilter(filterValue : string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
