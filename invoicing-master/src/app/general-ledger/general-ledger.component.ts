import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.css']
})
export class GeneralLedgerComponent implements OnInit {
  private view = 'Summary'

  constructor(private gb: GlobalsService) { }

  ngOnInit() {
  }

}
