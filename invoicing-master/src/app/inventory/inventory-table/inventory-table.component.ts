import { Component, OnInit } from '@angular/core';
import { InventoryTableDataSource } from './inventory-table-datasource';
import { GlobalsService } from 'src/app/globals.service';
import { MongoApiService } from 'src/app/mongo-api.service';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})
export class InventoryTableComponent implements OnInit {
  dataSource: InventoryTableDataSource;

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService
  ){}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['sku', 'description', 'avgCost', 'salePrice', 'soh'];

  ngOnInit() {
    this.dataSource = new InventoryTableDataSource(this.gb, this.api);
  }
}
