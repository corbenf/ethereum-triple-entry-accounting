import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-sent-invoices',
  templateUrl: './sent-invoices.component.html',
  styleUrls: ['./sent-invoices.component.css']
})
export class SentInvoicesComponent implements OnInit {

  constructor(private gb: GlobalsService) { }

  ngOnInit() {
  }

}
