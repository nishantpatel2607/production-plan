import { Component, OnInit } from '@angular/core';
import { IVMWorkOrderEvent } from '../../model/viewModel/workorderModels/vmWorkOrderEvent';
import { WorkOrderService } from '../../core/services/workorders.service';
import { IVMWorkOrderPlan } from '../../model/viewModel/workorderModels/vmWorkOrderPlan';
import { colorCodes } from '../../shared/colorCodes';



@Component({
  selector: 'app-wo-planner',
  templateUrl: './wo-planner.component.html',
  styleUrls: ['./wo-planner.component.css']
})
export class WoPlannerComponent implements OnInit {

  woEvents: IVMWorkOrderEvent[]=[]; //displayed on schedule control
  woPlans: IVMWorkOrderPlan[]=[]; //loaded from DB 
  header: any;
  //defaultDate;
  slot = '00:15:00';

  constructor(private workOrderService: WorkOrderService) { }

  ngOnInit() {
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    };

    //let currentDate = new Date();
    //let currentDateFrom = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    //let currentDateTo = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    //this.loadEvents(currentDateFrom,currentDateTo);
  }

  handleEventClick(e) {

  }

  dateRangeChanged(e) {
    let dateFrom = new Date(e.view.start._d);
    let dateTo = new Date(e.view.end._d);
    this.loadEvents(dateFrom, dateTo);
  }


  loadEvents(DtFrom: Date, DtTo: Date) {
    let colorcodes: colorCodes = new colorCodes();
    let dt1 = this.pad(DtFrom.getMonth() + 1) + "/" + this.pad(DtFrom.getDate()) + "/" + DtFrom.getFullYear();
    let dt2 = this.pad(DtTo.getMonth() + 1) + "/" + this.pad(DtTo.getDate()) + "/" + DtTo.getFullYear();
    console.log(dt1, dt2);
    this.workOrderService.getWorkOrderPlan(dt1, dt2).subscribe(
      woPlans => {
        this.woPlans = woPlans;
      }, (error) => { }, () => {
        let i: number = 0
        //convert woPlans to woEvents
        this.woPlans.forEach(plan => {
          let woEvent: IVMWorkOrderEvent = {
            id: plan.id,
            workOrderId: plan.workOrderId,
            workOrderNo: plan.workOrderNo,
            machineName: plan.machineName,
            assemblyName: plan.assemblyName,
            qty: plan.qty,
            title: plan.workOrderNo + ":" + (plan.machineName !== '' ? plan.machineName : plan.assemblyName),
            start: plan.plannedStartDate + "T" + plan.plannedStartTime,
            end: plan.plannedEndDate + "T" + plan.plannedEndTime,
            color: '',
            textColor:'black'
          }

          //find if work order with the id is already added
          let arWo = this.woEvents.filter(w => w.id == plan.id);
          if (arWo.length == 0) {
            //find if work order id is already added in the array and get its color
            let wo = this.woEvents.filter(w => w.workOrderId == plan.workOrderId);
            if (wo.length == 0) {
              if (i > colorcodes.colors.length - 1) { i = 0; }
              woEvent.color = colorcodes.colors[i];
              i++;
            } else {
              woEvent.color = wo[0].color;
            }
            this.woEvents.push(woEvent);
          }
        });
      }
    )

  }

  pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

}
