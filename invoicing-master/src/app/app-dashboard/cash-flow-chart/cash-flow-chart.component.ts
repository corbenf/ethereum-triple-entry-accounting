import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/globals.service';
import { 
  subMonths,
  isSameMonth,
  format as formatDate
} from 'date-fns';

@Component({
  selector: 'cash-flow-chart',
  templateUrl: './cash-flow-chart.component.html',
  styleUrls: ['./cash-flow-chart.component.css']
})
export class CashFlowChartComponent implements OnInit {

  cashFlowColors= [
    {
      backgroundColor: "rgba(137,208,245,1)",
      hoverBackgroundColor: "rgba(137,208,245,1)",
      borderColor: "rgba(137,208,245,1)",
      hoverBorderColor: "rgba(137,208,245,1)"
    }, 
    {
      backgroundColor: 'rgba(214,218,222,1)',
      hoverBackgroundColor: 'rgba(214,218,222,1)',
      borderColor: 'rgba(214,218,222,1)',
      hoverBorderColor: 'rgba(214,218,222,1)'
    }
  ]

  cashFlowData = [
    {
      data: [0, 0, 0, 0, 0, 0], 
      label: 'In'
    },
    {
      data: [0, 0, 0, 0, 0, 0], 
      label: 'Out'
    }
  ];

  cashFlowLabels = [
    formatDate(subMonths(new Date(), 5), 'MMMM'),
    formatDate(subMonths(new Date(), 4), 'MMMM'),
    formatDate(subMonths(new Date(), 3), 'MMMM'),
    formatDate(subMonths(new Date(), 2), 'MMMM'),
    formatDate(subMonths(new Date(), 1), 'MMMM'),
    formatDate(new Date(), 'MMMM')
  ];

  cashFlowOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontSize: 12
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      }]
    },
    tooltips: {
      mode: 'nearest',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      titleFontColor: 'rgba(0,0,0,.87)',
      bodyFontColor: 'rgba(0,0,0,.87)',
      displayColors: false,
      borderColor: 'rgba(0,0,0,.87)',
      borderWidth: 1
    },
    legend: {
      display: false
    }
  }

  cashFlowLegend = false;

  cashFlowType = 'bar';

  constructor(private gb: GlobalsService) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.gb.sentInvoices.forEach(inv => {
      if(inv.state=='Paid'){
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 5))){
          this.cashFlowData[0].data[0] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 4))){
          this.cashFlowData[0].data[1] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 3))){
          this.cashFlowData[0].data[2] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 2))){
          this.cashFlowData[0].data[3] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 1))){
          this.cashFlowData[0].data[4] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), new Date())){
          this.cashFlowData[0].data[5] += parseFloat(inv.grandTotal.toFixed(2));
        }
      }
    });

    this.gb.receivedInvoices.forEach(inv => {
      if(inv.state=='Paid'){
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 5))){
          this.cashFlowData[1].data[0] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 4))){
          this.cashFlowData[1].data[1] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 3))){
          this.cashFlowData[1].data[2] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 2))){
          this.cashFlowData[1].data[3] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), subMonths(new Date(), 1))){
          this.cashFlowData[1].data[4] += parseFloat(inv.grandTotal.toFixed(2));
        }
        if(isSameMonth(new Date(inv.dueDate), new Date())){
          this.cashFlowData[1].data[5] += parseFloat(inv.grandTotal.toFixed(2));
        }
      }
    });
  }

}
