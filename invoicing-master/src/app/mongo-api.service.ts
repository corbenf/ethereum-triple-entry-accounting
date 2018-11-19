import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ICompany } from './interfaces/company.interface';
import { IProduct } from './interfaces/product.interface';
import { IInvoice } from './interfaces/invoice.interface';
import { ILedgerAccount } from './interfaces/ledger-account.interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MongoApiService {
  private _url: string = 'http://localhost:2720/';
  allUsers = [];
  inventory = [];

  constructor(
    private gb: GlobalsService,
    private http: HttpClient
    ) {
      //Must be a better way to do this...
    this.getAllUsers()
      .subscribe(data => {
        this.gb.allUsers = data;
      });

    this.getAllInventory()
      .subscribe(data => {
        this.gb.allInventory = data;
      });
  }

/* User Requests START */
  getAllUsers(): Observable<ICompany[]>{
    return this.http.get<ICompany[]>(this._url+'user');
  }

  getUserDetails(_hexAcc): Observable<ICompany>{
    return this.http.get<ICompany>(this._url+'user/?hexacc='+_hexAcc);
  }
/* User Requests END */

/* Inventory Requests START */
  getAllInventory(): Observable<IProduct[]>{
    return this.http.get<IProduct[]>(this._url+'inventory');
  }

  getProduct(_sku): Observable<IProduct[]>{
    return this.http.get<IProduct[]>(this._url+'inventory/?sku='+_sku);
  }

  getUsersInventory(_user): Observable<IProduct[]>{
    return this.http.get<IProduct[]>(this._url+'inventory/all/?owner='+_user);
  }

  putInventorySale(_sku, _tx): Observable<IProduct>{
    return this.http.put<IProduct>(this._url+'inventory/sale/'+_sku, _tx, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  putInventoryPurchase(_sku, _data): Observable<IProduct>{
    return this.http.put<IProduct>(this._url+'inventory/purchase/'+_sku, _data, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
/* Inventory Requests END */

/* Invoice Requests START */
  getSentInvoices(_user): Observable<IInvoice[]>{
    return this.http.get<IInvoice[]>(this._url+'invoice/all/from/'+_user);
  }
  getReceivedInvoices(_user): Observable<IInvoice[]>{
    return this.http.get<IInvoice[]>(this._url+'invoice/all/to/'+_user);
  }

  postInvoice(_inv: IInvoice): Observable<IInvoice>{
    return this.http.post<IInvoice>(this._url+'invoice', _inv, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  updateInvoiceState(_inv: IInvoice, _bcIndex, _newState): Observable<IInvoice> {
    return this.http.put<IInvoice>(this._url+'invoice/'+_bcIndex+'/update-state/'+_newState, _inv, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  updateInvoiceSignature(_inv: IInvoice, _bcIndex, _signature): Observable<IInvoice> {
    return this.http.put<IInvoice>(this._url+'invoice/'+_bcIndex+'/sign/'+_signature, _inv, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
/* Invoice Requests End */

/* Ledger Account Requests START */
  getLedgerAccounts(_user): Observable<ILedgerAccount[]>{
    return this.http.get<ILedgerAccount[]>(this._url+'ledger-account/all/?owner='+_user);
  }

  putLedgerAccountEntry(_user, _accCode, _entryType, _entry): Observable<ILedgerAccount>{
    return this.http.put<ILedgerAccount>(this._url+'ledger-account/addentry/'+ _user +'/'+ _accCode +'/'+ _entryType, {details: _entry[0]}, httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  putInvoicePayment(_data): Observable<ILedgerAccount>{
    return this.http.put<ILedgerAccount>(this._url+'ledger-account/pay-invoice', _data, httpOptions)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
/* Ledger Account Requests End */


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something went wrong.');
  };
} 