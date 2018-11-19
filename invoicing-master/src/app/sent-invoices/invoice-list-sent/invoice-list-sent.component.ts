import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { GlobalsService } from '../../globals.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InvoicePopupModalComponent } from '../../invoice-popup-modal/invoice-popup-modal.component';
 
@Component({
  selector: 'invoice-list-sent',
  templateUrl: './invoice-list-sent.component.html',
  styleUrls: ['./invoice-list-sent.component.css']
})
export class InvoiceListSentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['number', 'reference', 'to', 'issueDate', 'dueDate', 'state'];

  constructor(
    private gb: GlobalsService,
    public dialog: MatDialog) { }

  ngOnInit() {
    //this.dataSource = new InvoiceListSentDataSource(this.paginator, this.sort);
  }

  openInvoiceModal(_bcIndex): void {
    const dialogRef = this.dialog.open(InvoicePopupModalComponent, {
      data: {blockchainIndex: _bcIndex}
    });

    /* dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    }); */
  }
}
