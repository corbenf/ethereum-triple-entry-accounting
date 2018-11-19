import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalsService } from '../globals.service';
import { EthContractService } from '../ethcontract.service';
import { MongoApiService } from '../mongo-api.service';

@Component({
  selector: 'app-invoice-popup-modal',
  templateUrl: './invoice-popup-modal.component.html',
  styleUrls: ['./invoice-popup-modal.component.css']
})
export class InvoicePopupModalComponent implements OnInit {
// Entire class needs an overhaul

  invoice;
  isUtilityBill: boolean = false;
  isRentBill: boolean = false;
  private gstPercentage: string;
  private working: boolean = false;

  constructor(
    private gb: GlobalsService,
    private eth: EthContractService,
    private api: MongoApiService,
    public dialogRef: MatDialogRef<InvoicePopupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eth.getInvoiceDetails(this.data.blockchainIndex).then(res => {
      this.invoice = res
      this.gstPercentage = (((this.invoice.grandTotal / this.invoice.subTotal) - 1) * 100).toFixed(2)
      if(this.invoice.from.hexAccount=='0x6044ca16e88a572900871b4f3ce791f710f6072f')this.isUtilityBill = true;
      if(this.invoice.from.hexAccount=='0x4d6599f828033bfe4dad97d94cb403137f828a95')this.isRentBill = true;
    })
  }

  ngOnInit() {
  }

  setHeaderColor() {
    let color: string;
    if(this.invoice){
      if(this.invoice.state=='Invoiced') color = '#4a8fc0'
      if(this.invoice.state=='Signed') color = '#f4aa42'
      if(this.invoice.state=='Paid') color = '#00a84e'
      if(this.invoice.state=='Overdue' || this.invoice.state=='Overdue (Signed)') color = '#f44141'
    } else {
      color = '#fff'
    }
    return {
      'background-color': color
    }
  }

  // I am sure one day I will cringe at myself for ever doing this...
  // So much worse than creating a new invoice
  signInvoice() {
    this.working = true;
    let newState = 'Signed';
    if(this.invoice.state=='Overdue') newState = 'Overdue (Signed)'
    let dataToSign = 
    'Formal Approval for Invoice Number: '.concat(this.invoice.number, '\n',
      'Amount payable: ', this.invoice.grandTotal, '\n',
      'From: ', this.gb.currentUser.name, '\n',
      'Account: ', this.gb.currentUser.hexAccount, '\n',
      'To: ', this.invoice.from.name, '\n',
      'Account: ', this.invoice.from.hexAccount
    );
    this.eth.signInvoice(this.data.blockchainIndex, dataToSign)
    .then(res => {
      this.api.updateInvoiceState(this.invoice, this.data.blockchainIndex, newState)
        .subscribe(data => {
          this.invoice.state = newState;
          this.gb.updateReceivedInvoice(this.data.blockchainIndex, {property: 'state', data: newState})
        });
      this.api.updateInvoiceSignature(this.invoice, this.data.blockchainIndex, res[0])
        .subscribe(data => {
          this.invoice.signature = res[0];
          this.gb.updateReceivedInvoice(this.data.blockchainIndex, {property: 'signature', data: res[0]})
        });

      let entry = [{
        date: new Date(),
        type: 'INV',
        transaction: this.invoice.from.name,
        amount: this.invoice.grandTotal,
        reference: this.invoice.reference,
        blockNumber: res[1].blockNumber,
        txHash: res[1].transactionHash
      }]
      this.api.putLedgerAccountEntry(this.gb.currentUser._id, 800, 'cr', entry)
      .subscribe(data => console.log('Accounts Payable updated', entry[0]));

      this.updateGSTAccount(entry[0]);
      
      if(this.isRentBill || this.isUtilityBill){
        let nonInventoryEntry = [{
          date: new Date(),
          type: 'INV',
          transaction: this.invoice.from.name,
          amount: this.invoice.subTotal,
          reference: this.invoice.reference,
          blockNumber: res[1].blockNumber,
          txHash: res[1].transactionHash
        }]
        if(this.isUtilityBill)this.api.putLedgerAccountEntry(this.gb.currentUser._id, 441, 'dr', nonInventoryEntry)
          .subscribe(data => {console.log('Utilities Account updated', nonInventoryEntry[0]); this.working = false;});
        else if(this.isRentBill)this.api.putLedgerAccountEntry(this.gb.currentUser._id, 440, 'dr', nonInventoryEntry)
          .subscribe(data => {console.log('Rent Account updated', nonInventoryEntry[0]); this.working = false;});
      } else this.updateInventory(entry[0]);
    })
    .catch(err => {
      alert('Signing failed...');
      console.error(err);
      this.working = false;
    });
  }

  payInvoice(){
    this.working = true;
    let newState = 'Paid';
    this.eth.payInvoice(this.data.blockchainIndex, this.invoice.grandTotal)
    .then(res => {
      this.api.updateInvoiceState(this.invoice, this.data.blockchainIndex, newState)
        .subscribe(data => {
          this.invoice.state = newState;
          this.invoice.amountPaid = this.invoice.grandTotal;
          this.gb.updateReceivedInvoice(this.data.blockchainIndex, {property: 'state', data: newState})
          let entry = {
            supplier: this.invoice.from._id,
            userId: this.gb.currentUser._id,
            data: {
              date: new Date(),
              type: 'PAY',
              transaction: ['Payment: ' + this.invoice.from.name, 'Payment: ' + this.invoice.to.name],
              amount: this.invoice.grandTotal,
              reference: [this.invoice.reference, this.invoice.number],
              blockNumber: res[0].blockNumber,
              txHash: res[0].transactionHash
            }
          }
          this.api.putInvoicePayment(entry)
            .subscribe(data => {
              console.log('putInvoicePayment', data)
              this.working = false;
            });
        });
    })
    .catch(err => {
      alert('Payment failed...');
      console.error(err);
      this.working = false;
    });
  }

  updateGSTAccount(entry){
    let lcEntry = [{
      date: entry.date,
      type: 'INV',
      transaction: this.invoice.from.name,
      amount: this.invoice.GST,
      reference: this.invoice.reference,
      blockNumber: entry.blockNumber,
      txHash: entry.txHash
    }]
    this.api.putLedgerAccountEntry(this.gb.currentUser._id, 820, 'dr', lcEntry)
      .subscribe(data => console.log('GST Account updated', lcEntry));
  }

  updateInventory(entry){
    let counter = this.invoice.lines.length
    this.invoice.lines.forEach(item => {
      console.log(counter, "lines with transactions to post", entry)
      let data = {
        owner: this.gb.currentUser._id,
        from: entry.transaction,
        transaction: [{
          date: entry.date,
          type: 'Purchase',
          reference: entry.reference,
          qty: item.qty,
          unitPrice: parseFloat((item.salePrice - (item.salePrice * (item.discount/100))).toFixed(2)),
          blockNumber: entry.blockNumber,
          txHash: entry.txHash
        }]
      };

      this.api.putInventoryPurchase(item.sku, data)
        .subscribe(data => {
          console.log("Inventory Updated", data)
          counter--;
          if(counter==0)this.working = false;
        })
    });
  }
}
