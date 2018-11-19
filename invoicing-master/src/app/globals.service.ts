import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICompany } from './interfaces/company.interface';
import { IProduct } from './interfaces/product.interface';
import { IInvoice } from './interfaces/invoice.interface';
import { ILedgerAccount } from './interfaces/ledger-account.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  // Must be a much better way to do this.. to research.
  allUsers;
  allInventory;
  currentUser;
  userInventory;
  userLedgerAccounts;
  sentInvoices;
  receivedInvoices;
  
  constructor() { }

  spliceCurrentUserFromAllUsers(_user){
    let i = this.allUsers.findIndex(x => x._id === _user._id)
    if(i!=-1) this.allUsers.splice(i, 1);
  }

  userHexAccToName(_hexAcc){
    let i = this.allUsers.findIndex(x => x.hexAccount === _hexAcc)
    if(i!=-1) return this.allUsers[i].name;
  }

  userHexAccToUserObject(_hexAcc){
    let i = this.allUsers.findIndex(x => x.hexAccount === _hexAcc.toLowerCase())
    if(i!=-1) return this.allUsers[i];
    else return this.currentUser;
  }

  updateSentInvoice(_bcIndex, update){
    let i = this.sentInvoices.findIndex(x => x.blockchainIndex === _bcIndex)
    if(update.property=='state') this.sentInvoices[i].state = update.data;
    if(update.property=='signature') this.sentInvoices[i].signature = update.data;
  }

  updateReceivedInvoice(_bcIndex, update){
    let i = this.receivedInvoices.findIndex(x => x.blockchainIndex === _bcIndex)
    if(update.property=='state') this.receivedInvoices[i].state = update.data;
    if(update.property=='signature') this.receivedInvoices[i].signature = update.data;
  }
}
