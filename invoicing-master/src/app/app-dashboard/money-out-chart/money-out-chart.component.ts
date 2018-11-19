import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/globals.service';
import { 
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isThisWeek,
  isSameWeek,
  isSameMonth,
  format as formatDate
} from 'date-fns';

@Component({
  selector: 'money-out-chart',
  templateUrl: './money-out-chart.component.html',
  styleUrls: ['./money-out-chart.component.css']
})
export class MoneyOutChartComponent implements OnInit {

  moneyOutColors= [
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

  moneyOutData = [
    {
      data: ['-', '-', 0, 0, 0, 0], 
      label: 'Outstanding'
    },
    {
      data: [0, 0, '-', '-', '-', '-'], 
      label: 'Overdue'
    }
  ];

  moneyOutLabels = ['Older', 'Last Week', 'This Week', 'Next Week', 'Week After', 'Future'];

  moneyOutOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false,
        },
        ticks: {
          fontSize: 12
        }
      }],
      yAxes: [{
        stacked: true,
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

  moneyOutLegend = false;

  moneyOutType = 'bar';

  outstandingCount = 0;
  outstandingValue = 0;
  overdueCount = 0;
  overdueValue = 0;

  constructor(private gb: GlobalsService) { }

  ngOnInit() {
    if(!isSameMonth(subWeeks(startOfWeek(new Date()), 1), subWeeks(endOfWeek(new Date()), 1))){
      this.moneyOutLabels[1] = formatDate(subWeeks(startOfWeek(new Date()), 1), 'D MMM') + '-' + formatDate(subWeeks(endOfWeek(new Date()), 1), 'D MMM');
    }else{
      this.moneyOutLabels[1] = formatDate(subWeeks(startOfWeek(new Date()), 1), 'D') + '-' + formatDate(subWeeks(endOfWeek(new Date()), 1), 'D MMM');
    }

    if(!isSameMonth(addWeeks(startOfWeek(new Date()), 1), addWeeks(endOfWeek(new Date()), 1))){
      this.moneyOutLabels[3] = formatDate(addWeeks(startOfWeek(new Date()), 1), 'D MMM') + '-' + formatDate(addWeeks(endOfWeek(new Date()), 1), 'D MMM');
    }else{
      this.moneyOutLabels[3] = formatDate(addWeeks(startOfWeek(new Date()), 1), 'D') + '-' + formatDate(addWeeks(endOfWeek(new Date()), 1), 'D MMM');
    }

    if(!isSameMonth(addWeeks(startOfWeek(new Date()), 2), addWeeks(endOfWeek(new Date()), 2))){
      this.moneyOutLabels[4] = formatDate(addWeeks(startOfWeek(new Date()), 2), 'D MMM') + '-' + formatDate(addWeeks(endOfWeek(new Date()), 2), 'D MMM');
    }else{
      this.moneyOutLabels[4] = formatDate(addWeeks(startOfWeek(new Date()), 2), 'D') + '-' + formatDate(addWeeks(endOfWeek(new Date()), 2), 'D MMM');
    }
    this.refreshData()
  }

  refreshData() {
    let owingAmt = 0;
    let owingCnt = 0;
    let overdueAmt = 0;
    let overdueCnt = 0;
    this.gb.receivedInvoices.forEach(inv => {
      let dueDate = new Date(inv.dueDate);
      if(inv.state != "Paid"){
        if(isSameWeek(dueDate, subWeeks(new Date(), 2)) || dueDate < subWeeks(new Date(), 2)){ //older
          //console.log('older', i, dueDate);
          this.moneyOutData[1].data[0] += inv.grandTotal;
          overdueAmt += inv.grandTotal;
          overdueCnt++;
        }
        else if(isSameWeek(dueDate, subWeeks(new Date(), 1))){ //last week
          //console.log('last week', i, inv, dueDate);
          this.moneyOutData[1].data[1] += inv.grandTotal;
          overdueAmt += inv.grandTotal;
          overdueCnt++;
        }
        else if(isThisWeek(dueDate)){ //this week
          //console.log('this week', i, inv, dueDate);
          this.moneyOutData[0].data[2] += inv.grandTotal;
          owingAmt += inv.grandTotal;
          owingCnt++;
        }
        else if(isSameWeek(dueDate, addWeeks(new Date(), 1))){ //next week
          //console.log('next week', i, inv, dueDate);
          this.moneyOutData[0].data[3] += inv.grandTotal;
          owingAmt += inv.grandTotal;
          owingCnt++;
        }
        else if(isSameWeek(dueDate, addWeeks(new Date(), 2))){ //week after
          //console.log('week after', i, inv, dueDate);
          this.moneyOutData[0].data[4] += inv.grandTotal;
          owingAmt += inv.grandTotal;
          owingCnt++;
        }
        else if(isSameWeek(dueDate, addWeeks(new Date(), 3)) || dueDate > addWeeks(new Date(), 3)){ //future
          //console.log('future', i, inv, dueDate);
          this.moneyOutData[0].data[5] += inv.grandTotal;
          owingAmt += inv.grandTotal;
          owingCnt++;
        }
      }
    });
    this.outstandingCount = owingCnt,
    this.outstandingValue = owingAmt,
    this.overdueCount = overdueCnt,
    this.overdueValue = overdueAmt
  }

}
