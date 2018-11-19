import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service'

@Component({
  selector: 'app-received-invoices',
  templateUrl: './received-invoices.component.html',
  styleUrls: ['./received-invoices.component.css']
})
export class ReceivedInvoicesComponent implements OnInit {

  constructor(private gb: GlobalsService) { }

  ngOnInit() {
  }

}
