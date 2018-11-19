import { Component } from '@angular/core';
import { GlobalsService } from './globals.service';
import { MongoApiService } from './mongo-api.service';
import { EthContractService } from './ethcontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'invoicing-master';

  constructor(
    private gb: GlobalsService,
    private api: MongoApiService,
    private eth: EthContractService
  ){}

}