import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import { MongoApiService } from './mongo-api.service';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import { IInvoice } from './interfaces/invoice.interface';
 
declare let require: any;
declare let window: any;
 
let invoiceContractJson = require('../../../build/contracts/Invoice.json');

@Injectable({
  providedIn: 'root'
})
export class EthContractService {
  private web3Provider = window.ethereum;
  private Invoice = TruffleContract(invoiceContractJson);
  hexAccount;

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService
    ) {
    if (window.ethereum){
      this.web3Provider = window.ethereum;
      window.ethereum.enable();
      console.log('current provider: window.ethereum');
    } else if (window.web3) {
      this.web3Provider = window.web3.currentProvider;
      console.log('current provider: window.web3');
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8501');
      console.warn('Injected provider not detected. Running on the localhost fallback provider.');
    }
    window.web3 = new Web3(this.web3Provider);
    this.Invoice.setProvider(this.web3Provider);

    // Get the current active account in MetaMask and set it as the default for invoice deployment
    this.setHexAccount()
      .then(acc => {
        this.hexAccount = acc;
        this.Invoice.defaults({
          from: this.hexAccount
      })
      // GET all data related to current user from MongoDB.
      // !!!Research dealing with Async and Observables properly!!!
      api.getUserDetails(this.hexAccount)
        .subscribe(data => {
          this.gb.currentUser = data[0];
          this.gb.spliceCurrentUserFromAllUsers(data[0]);
          api.getUsersInventory(this.gb.currentUser._id)
            .subscribe(data => this.gb.userInventory = data)
          api.getSentInvoices(this.hexAccount)
            .subscribe(data => this.gb.sentInvoices = data)
          api.getReceivedInvoices(this.hexAccount)
            .subscribe(data => this.gb.receivedInvoices = data)
          api.getLedgerAccounts(this.gb.currentUser._id)
            .subscribe(data => this.gb.userLedgerAccounts = data)
        });
    });
  }

  ngOnInit() {
    // Research constructor vs ngOnInit.
  }

  setHexAccount() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase((err, acc) => {
        if(!err) resolve(acc);
        else reject(err);
      })
    });
  }

  //Method for getting Invoice Template Address
  getInvoiceAddress() {
    this.Invoice.deployed().then(inst => {
      console.log(inst);
    });
  }

  // Get details from specified invoice contract on the blockchain
  getInvoiceDetails(_bcIndex) {
    return new Promise((resolve, reject) => {
      this.Invoice.at(_bcIndex)
        .then(inst => {
          return inst.getInvoiceDetails.call();
        })
        .then(_inv => {
          let response = {
            number: _inv._number.toNumber(), // From BN to number
            issueDate: new Date(_inv._issueDate.toNumber() * 1000), // From Unix timestamp to Date
            to: this.gb.userHexAccToUserObject(_inv._to),
            from: this.gb.userHexAccToUserObject(_inv._from),
            dueDate: new Date(_inv._dueDate.toNumber() * 1000), // From Unix timestamp to Date
            reference: window.web3.utils.hexToUtf8(_inv._ref), // From hex/bytes to human readable Utf8
            lines: this.splitInvoiceLines(_inv._lines), // Transform array of hex/bytes to array of invoice line objects
            subTotal: window.web3.utils.fromWei(_inv._subTotal, 'ether'), // From wei BN to ether value as a number
            GST: window.web3.utils.fromWei(_inv._GST, 'ether'),
            grandTotal: window.web3.utils.fromWei(_inv._grandTotal, 'ether'),
            amountPaid: window.web3.utils.fromWei(_inv._amountPaid, 'ether'),
            signature: _inv._custSig,
            state: this.getInvoiceStateString(_inv._state.toNumber()) // From Soidity Enum (int) to String description
          }
          resolve(response);
        });
    });
  }

  getInvoiceStateString(_stateNumber){
    if(_stateNumber==0) return 'Invoiced'
    if(_stateNumber==1) return 'Signed'
    if(_stateNumber==2) return 'Paid'
    if(_stateNumber==3) return 'Overdue'
    if(_stateNumber==4) return 'Overdue (Signed)'
  }

  // Deploy new Invoice Smart Contract to Ethereum blockchain
  // Could be better if this was handled in the back-end?
  postInvoice(_inv) {
    return new Promise((resolve, reject) => {
      // Subscribe to listen for 'logNewInvoice' event on the invoice smart contract.
      let subscription = window.web3.eth.subscribe('logs', {
        topics: ['0x741f25eb0e928f89e35b6a29951d9cc8e8a81b58ea520e685beebbc67b9ca161']
      }, (err, res) => {
        if(err) reject(err);
        else {
          // Return full IInvoice for POSTing to MongoDB
          let response: IInvoice = {
            number: _inv.number,
            issueDate: _inv.issueDate,
            to: _inv.to,
            from: _inv.from,
            dueDate: _inv.dueDate,
            reference: _inv.reference,
            lines: _inv.lines,
            subTotal: _inv.subTotal,
            GST: _inv.GST,
            grandTotal: _inv.grandTotal,
            signature: '0x0',
            state: 'Invoiced',
            blockchainIndex: res.address,
            blockNumber: res.blockNumber,
            txHash: res.transactionHash
          }
          subscription.unsubscribe();
          resolve(response);
        }
      });
      // Deploy a new invoice contract to the blockchain.
      // Makes all values Solidity compatible
      this.Invoice.new(
        _inv.number,
        _inv.issueDate.getTime()/1000, // Date to Unix timestamp
        _inv.to,
        _inv.from,
        _inv.dueDate.getTime()/1000, // Date to Unix timestamp
        window.web3.utils.utf8ToHex(_inv.reference), // From string to hex/bytes
        this.concatInvoiceLines(_inv.lines), // From array of invoice line objects to array of hex/bytes
        window.web3.utils.toWei(_inv.subTotal.toString(), 'ether'), // From number to Ether value in wei
        window.web3.utils.toWei(_inv.GST.toString(), 'ether'), // From number to Ether value in wei
        window.web3.utils.toWei(_inv.grandTotal.toString(), 'ether') // From number to Ether value in wei
      )
      .catch(err => {
        console.error("Post Invoice Promise Error", err)
        reject(err);
      })
    })
  }

  // To overcome quirk with Solidity not accepting object arrays and not working well with strings
  // Concatinates main line item attributes to delimited string and converts the string to hex/bytes
  // Limited to 32 characters max
  private concatInvoiceLines(_invLines){
    let invLinesHex = [];

    _invLines.forEach((item) => {
      invLinesHex.push(window.web3.utils.utf8ToHex(
        item.sku + ":" +
        item.unitCost + ":" +
        item.qty + ":" +
        item.discount));
    })
    return invLinesHex;
  }

  // Reverses concatination made in this.concatInvoiceLines when getting invoice details from the blockchain
  private splitInvoiceLines(_invLines){
    let lcLines = [];
    _invLines.forEach(line => {
      var lcSplit = window.web3.utils.hexToUtf8(line).split(":");
      
      /* Awful workaround. 
       Gets the item description from global inventory array then checks if the sku is > than 500.
       If >500 then this is an invoice for inventory items and need to get users related sku.
       If <500 then this is a utility invoice. sku not important.

       Numerous ways that this could be improved.
      */
      let gbInventoryIndex = this.gb.allInventory.findIndex(x => x.sku === lcSplit[0]);
      if(gbInventoryIndex!=-1) var lookUp = this.gb.allInventory[gbInventoryIndex].description;
      if(lcSplit[0]>500){
        let lcInventoryIndex = this.gb.userInventory.findIndex(x => x.description === lookUp);
        if(lcInventoryIndex!=-1) var userItem = this.gb.userInventory[lcInventoryIndex];
      } else {
        var userItem = this.gb.allInventory[gbInventoryIndex];
      }

      lcLines.push({
          sku: userItem.sku,
          description: userItem.description,
          salePrice: lcSplit[1],
          qty: lcSplit[2],
          discount: lcSplit[3],
          lineTotal: (lcSplit[1] - (lcSplit[1] * (lcSplit[3]/100))) * lcSplit[2]
      });            
  });
  return lcLines;
  }

  // As with this.postInvoice, could be better if this was handled in the back-end
  signInvoice(_bcIndex, _data){
    let signature;
    // Maybe use Observable instead of Promise if not moved to back-end
    return new Promise((resolve, reject)=>{
      // Subscribe to listen for 'logInvoiceSigned' event on the invoice smart contract.
      let subscription = window.web3.eth.subscribe('logs', {address: _bcIndex}, (err, res) => {
        if(err) reject(err)
        else{
          subscription.unsubscribe();
          resolve([signature, res]);
        }
      })
      // Cryptographically sign message with users private key
      window.web3.eth.personal.sign(_data, this.hexAccount)
      .then(res => {
        signature = res;
        return this.Invoice.at(_bcIndex)
      })
      .then(inst =>{
        return inst.signInvoice(signature)
      })
      .catch(err => reject(err))
    })
  }

  // Again, possibly better to move to back-end?
  payInvoice(_bcIndex, _grandTotal){
    // Convert number to ether value in wei
    let lcGrandTotalEther = window.web3.utils.toWei(_grandTotal, 'ether');
    return new Promise((resolve, reject) => {
      // Subscribe to listen for 'logInvoicePayment' event on the invoice smart contract.
      let subscription = window.web3.eth.subscribe('logs', {
        address: _bcIndex,
        topics: ['0x1ce31329373a5bd3ffd31b603ad81593585a9df721cc88b72245c6812f942973']
      }, (err, res) =>{
        if(err) reject(err)
        else{
          subscription.unsubscribe();
          resolve([res]);
        }
      });
      // Call payInvoice method on smart contract
      this.Invoice.at(_bcIndex)
      .then(inst => {
        inst.payInvoice(lcGrandTotalEther, {from: this.hexAccount, value: lcGrandTotalEther});
      })
      .catch(err => reject(err))
    })
  }
}
