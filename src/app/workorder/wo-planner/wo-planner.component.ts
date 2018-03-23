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

  woEvents: IVMWorkOrderEvent[] = []; //displayed on schedule control
  woPlans: IVMWorkOrderPlan[] = []; //loaded from DB 
  header: any;
  showWOSelector: boolean = false;
  colorIndex: number = 0;
  colorcodes: colorCodes;
  //defaultDate;
  slot = '00:15:00';
  initializeFlag: boolean = true;

  constructor(private workOrderService: WorkOrderService) {
    this.colorcodes = new colorCodes();
  }

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
    let dt1 = this.pad(DtFrom.getMonth() + 1) + "/" + this.pad(DtFrom.getDate()) + "/" + DtFrom.getFullYear();
    let dt2 = this.pad(DtTo.getMonth() + 1) + "/" + this.pad(DtTo.getDate()) + "/" + DtTo.getFullYear();
    //console.log(dt1, dt2);
    this.workOrderService.getWorkOrderPlan(dt1, dt2).subscribe(
      woPlans => {
        this.woPlans = woPlans;
      }, (error) => { }, () => {

        //convert woPlans to woEvents
        this.woPlans.forEach(plan => {
          this.AddWorkOrderPlan(plan);
        });
      }
    )

  }

  AddWorkOrderPlan(plan: IVMWorkOrderPlan) {
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
      textColor: 'black',
      isDirty: false
    }

    if (woEvent.id == 0) woEvent.isDirty = true; //new plan added

    //find if work order with the id is already added
    let arWo = this.woEvents.filter(w => w.id == plan.id && w.id > 0);
    if (arWo.length == 0) {
      //find if work order id is already added in the array and get its color
      let wo = this.woEvents.filter(w => w.workOrderId == plan.workOrderId);
      if (wo.length == 0) {
        if (this.colorIndex > this.colorcodes.colors.length - 1) { this.colorIndex = 0; }
        woEvent.color = this.colorcodes.colors[this.colorIndex];
        this.colorIndex++;
      } else {
        woEvent.color = wo[0].color;
      }

      //check if work order id and same start date time already exist then do not add
      let index = this.woEvents.findIndex(w => w.workOrderId == woEvent.workOrderId && w.start == woEvent.start);
      if (index < 0) {
        this.woEvents.push(woEvent);
        console.log(woEvent);
      }


    }
  }

  changeEventDuration(event) {

    if (event.event.id > 0) {
      let index = this.woEvents.findIndex(w => w.id == event.event.id);
      if (index >= 0) {
        this.woEvents[index].isDirty = true;
      }
      event.event.isDirty = true;

      console.log(event.event);
      console.log(this.woEvents);
    }
  }

  saveWOPlan() {
    let woPlans: IVMWorkOrderPlan[] = [];
    this.woEvents.forEach(woEvent => {
      if (woEvent.id === 0 || woEvent.isDirty) {
        let startDtTm: string [] = woEvent.start.split('T');
        let endDtTm: string[] = woEvent.end.split('T');
        let wPlan: IVMWorkOrderPlan = {
          id: woEvent.id,
          workOrderId: woEvent.workOrderId,
          workOrderNo: woEvent.workOrderNo,
          machineName: woEvent.machineName,
          assemblyName: woEvent.assemblyName,
          qty: woEvent.qty,
          plannedStartDate:startDtTm[0],
          plannedEndDate:endDtTm[0],
          plannedStartTime : startDtTm[1],
          plannedEndTime: endDtTm[1],
          actualEndDate:'',
          actualEndTime:'',
          actualStartDate:'',
          actualStartTime:''
        }
        woPlans.push(wPlan);
      }
    });
    if (woPlans.length > 0){ 
      console.log(woPlans);
      //call service to save the events and redraw events
      //returned from the server.
    }
  }

  pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  showSelector() {
    this.initializeFlag = !this.initializeFlag;
    this.showWOSelector = true;
  }

  hideWOSelector() {
    // console.log('hide');
    this.showWOSelector = false;
  }

  selectWO(selectedWO: IVMWorkOrderPlan) {
    //console.log(selectedWO);
    this.AddWorkOrderPlan(selectedWO);
    this.showWOSelector = false;
  }



}
