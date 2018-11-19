import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EthContractService } from '../ethcontract.service';
import { GlobalsService } from '../globals.service';

declare let window: any;

@Component({
  selector: 'app-transaction-receipt-modal',
  templateUrl: './transaction-receipt-modal.component.html',
  styleUrls: ['./transaction-receipt-modal.component.css']
})
export class TransactionReceiptModalComponent implements OnInit {
  transactionReceipt;
  transaction;
  blockDetails;
  invoice;

  display;

  constructor(
    private gb: GlobalsService,
    private eth: EthContractService,
    public dialogRef: MatDialogRef<TransactionReceiptModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if(this.data.txHash!='n/a') {
      window.web3.eth.getTransactionReceipt(this.data.txHash)
      .then(receipt => {
        this.transactionReceipt = receipt;
        return window.web3.eth.getTransaction(this.data.txHash);
      })
      .then(tx => {
        this.transaction = tx;
        return window.web3.eth.getBlock(tx.blockNumber);
      })
      .then(block => {
        this.blockDetails = block;
        if(this.transactionReceipt.contractAddress) return this.eth.getInvoiceDetails(this.transactionReceipt.contractAddress);
        else return this.eth.getInvoiceDetails(this.transactionReceipt.to);
      })
      .then(inv => {
        this.invoice = inv;
        this.buildDisplay();
      })
    } else {
      window.web3.eth.getBlock(0)
      .then(block => {
        this.blockDetails = block;
        this.display = {
          to: 'Blockchain Investments',
          toAccount: 'n/a',
          from: this.gb.currentUser.name,
          fromAccount: this.gb.currentUser.hexAccount,
          contractAddress: 'n/a',
          blockNumber: 0,
          timestamp: this.blockDetails.timestamp,
          date: new Date(this.blockDetails.timestamp*1000),
          signature: '',
          value: 0,
          type: 'Blockchain Capital Investment'
        }
      })
    }
  }

  buildDisplay() {
    let lcContractAddress;
    let lcTo;
    let lcToAccount;
    let lcFrom;
    let lcFromAccount;
    let lcSignature;
    let lcType;
    let lcValue = window.web3.utils.fromWei(this.transaction.value, 'ether');
    if(this.transactionReceipt.contractAddress) {
      lcContractAddress = this.transactionReceipt.contractAddress;
      lcTo = this.invoice.to.name;
      lcToAccount = this.invoice.to.hexAccount;
      lcFrom = this.invoice.from.name;
      lcFromAccount = this.invoice.from.hexAccount;
      lcType = 'Invoice Deployment';
    } else {
      lcContractAddress = this.transactionReceipt.to;
      if(parseFloat(lcValue)<1) {
        lcTo = this.invoice.to.name;
        lcToAccount = this.invoice.to.hexAccount;
        lcFrom = this.invoice.from.name;
        lcFromAccount = this.invoice.from.hexAccount;
        lcType = 'Invoice Approval/Signing';
        lcSignature = this.invoice.signature;
      } else {
        lcTo = this.invoice.from.name;
        lcToAccount = this.invoice.from.hexAccount;
        lcFrom = this.invoice.to.name;
        lcFromAccount = this.invoice.to.hexAccount;
        lcType = 'Invoice Payment';
      }
    }

    this.display = {
      to: lcTo,
      toAccount: lcToAccount,
      from: lcFrom,
      fromAccount: lcFromAccount,
      contractAddress: lcContractAddress,
      blockNumber: this.transactionReceipt.blockNumber,
      timestamp: this.blockDetails.timestamp,
      date: new Date(this.blockDetails.timestamp*1000),
      signature: lcSignature,
      value: lcValue,
      type: lcType
    }
  }

}
