import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { GlobalsService } from '../globals.service';
import { EthContractService } from '../ethcontract.service';
import { MongoApiService } from '../mongo-api.service';
import { IInvoice } from '../interfaces/invoice.interface'
import {Validators, 
  FormBuilder, 
  FormGroup, 
  FormControl, 
  FormArray} from '@angular/forms';

@Component({
  selector: 'app-new-sales-invoice',
  templateUrl: './new-sales-invoice.component.html',
  styleUrls: ['./new-sales-invoice.component.css']
})
export class NewSalesInvoiceComponent implements OnInit {
  formSubmitted: boolean = false;
  today: Date = new Date();
  defaultDueDate: Date = new Date(new Date(this.today).setMonth(this.today.getMonth()+1));
  numberPatern: string = '^[0-9.,]+$';
  newSalesInvoiceForm: FormGroup;

  subTotal: number = 0;
  GST: number = 0;
  grandTotal: number = 0;

  constructor(
    private gb: GlobalsService,
    private fb: FormBuilder,
    private eth: EthContractService,
    private api: MongoApiService
    ) { }

  ngOnInit() {
    this.refreshForm();
  }

  private refreshForm(){
    this.subTotal = 0;
    this.GST = 0;
    this.grandTotal = 0;
    this.newSalesInvoiceForm = this.fb.group({
      number: [{value: this.gb.currentUser.currentInvoiceNumber, disabled: true}],
      issueDate: [{value: formatDate(this.today, 'MM/dd/yyyy', 'en_NZ'), disabled: true}],
      to: ['', Validators.required],
      from: [this.gb.currentUser.hexAccount],
      dueDate: [this.defaultDueDate.toISOString().split('T')[0]],
      reference: [''],
      lines: this.fb.array([
        this.getLineItem()
      ])
    });
    // initialize stream on line items
    const lineValueChanges$ = this.newSalesInvoiceForm.controls['lines'].valueChanges;
    // subscribe to the stream so listen to changes on line items
    lineValueChanges$.subscribe(lines => this.updateLineTotals(lines));

    this.formSubmitted = false;
  }

  private getLineItem() {
    const numberPatern = '^[0-9.,]+$';
    return this.fb.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      unitCost: [0],
      qty:  [1, [Validators.required, Validators.pattern(numberPatern)]],
      discount:  [0, [Validators.pattern(numberPatern)]],
      lineTotal: [{value: 0, disabled: true}]
    });
  }

  // Add new line item row into form, onClick for add button
  private addLineItem() {
    const control = <FormArray>this.newSalesInvoiceForm.controls['lines'];
    control.push(this.getLineItem());
  }

  // Remove line item row from form, onClick for delete button
  private removeLineItem(i: number) {
    const control = <FormArray>this.newSalesInvoiceForm.controls['lines'];
    control.removeAt(i);
  }

  private updateLineItems($event, selectedIndex){
    let i = this.gb.userInventory.findIndex(x => x.sku === $event)
    // get the lines group control
    const control = <FormArray>this.newSalesInvoiceForm.controls['lines'];
    control.at(selectedIndex).get('name').setValue(this.gb.userInventory[i].description);
    control.at(selectedIndex).get('unitCost').setValue(this.gb.userInventory[i].salePrice);
  }

  private updateLineTotals(lines: any) {
    // get the lines group control
    const control = <FormArray>this.newSalesInvoiceForm.controls['lines'];
    // before recount, subTotal needs to be reset. 
    this.subTotal = 0;

    for (let i in lines) {
      let lineTotal = ((lines[i].unitCost-(lines[i].unitCost*(lines[i].discount/100)))*lines[i].qty);
      // update lineTotal field on line and do not emit event myFormValueChanges$ in this case on units
      control.at(+i).get('lineTotal').setValue(parseFloat(lineTotal.toFixed(2)), {onlySelf: true, emitEvent: false});
      // update subTotal
      this.subTotal += parseFloat(lineTotal.toFixed(2));
    }
    // Calculate GST and grandTotal
    this.GST = parseFloat((this.subTotal * 0.15).toFixed(2));
    this.grandTotal = this.subTotal + this.GST;
  }

  private submitInvoice(){
    //Show the loader
    this.formSubmitted = true;
    // Get form data (raw including disabled fields)
    let formData = this.newSalesInvoiceForm.getRawValue();

    // Make sure reference isn't blank to avoid errors with Solidity
    // Could simplify...
    let reference = formData.reference;
    if(!reference) reference = '-'

    // Could simplify
    let invoice = {
      number: formData.number,
      issueDate: this.today,
      to: formData.to,
      from: formData.from,
      dueDate: new Date(formData.dueDate),
      reference: reference,
      lines: formData.lines,
      subTotal: this.subTotal,
      GST: this.GST,
      grandTotal: this.grandTotal
    }
    // Deploy new invoice smart contract to blockchain 
    // Then POST invoice to MongoDB and update the ledger accounts. Ugly
    this.eth.postInvoice(invoice)
      .then(res => {
        let inv: IInvoice = res as IInvoice
        this.api.postInvoice(res as IInvoice)
         .subscribe(data => {
           this.gb.sentInvoices.push(data);
           this.gb.currentUser.currentInvoiceNumber += 1;
          })
        this.updateLedgerAccounts(inv);
      });
  }

  // Ugly spaghetti.. also too susceptible to breaking/partially updating records and causing inconsistencies.
  // Should all be handled on back-end inside a MongoDB transaction to make it ACID compliant.
  // Need to research this
  updateLedgerAccounts(inv){
    let entry = [{
      date: inv.issueDate,
      type: 'INV',
      transaction: this.gb.userHexAccToName(inv.to),
      amount: inv.grandTotal,
      reference: inv.number,
      blockNumber: inv.blockNumber,
      txHash: inv.txHash
    }]
    this.api.putLedgerAccountEntry(this.gb.currentUser._id, 610, 'dr', entry)
      .subscribe(data => {
        console.log('Accounts Receivable updated', entry[0]);
        entry[0].amount = inv.GST;
        this.api.putLedgerAccountEntry(this.gb.currentUser._id, 820, 'cr', entry)
          .subscribe(data => {
            console.log('GST Account updated', entry[0]);
            if(parseInt(inv.lines[0].sku)>500) this.updateInventory(inv)
            else {
              alert('Invoice ' + inv.number + ' has successfully been submitted!')
              this.refreshForm();
            }
          });
      })
  }

  updateInventory(inv){
    let counter = inv.lines.length
    inv.lines.forEach(item => {
      console.log(counter, "lines with transactions to post")
      let i = this.gb.userInventory.findIndex(x => x.sku === item.sku)
      let product = this.gb.userInventory[i];
      console.log("product", product);
      console.log("average cost", parseFloat(((product.totalValue/product.soh) * item.qty).toFixed(2)));
      this.api.putInventorySale(
        item.sku,
        {
          owner: this.gb.currentUser._id,
          to: this.gb.userHexAccToName(inv.to),
          transaction: [{
            date: inv.issueDate,
            type: 'Invoice',
            reference: inv.number,
            qty: item.qty,
            unitPrice: item.unitCost - (item.unitCost * (item.discount / 100)),
           blockNumber: inv.blockNumber,
            txHash: inv.txHash
          }],
          averageCost: parseFloat(((product.totalValue/product.soh) * item.qty).toFixed(2))
        }
      )
        .subscribe(data => {
          counter--
          if(counter==0){
            alert('Invoice ' + inv.number + ' has successfully been submitted!')
            this.refreshForm();
          }
        })
    });
  }
}
