import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { isQuote } from '@angular/compiler';
export enum MessageType { Information, Warning, Error, Question } 

export interface MessageBoxModel {
  title: string;
  message: string;
  messageType: MessageType;
}

@Component({
  selector: "message-box",
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent extends DialogComponent<MessageBoxModel, boolean> implements MessageBoxModel {
  title: string;
  message: string;
  messageType: MessageType;
  isQuestion: boolean;
  constructor(dialogService: DialogService) {
    super(dialogService);
    
  }

  getClass() {
    if (this.messageType === MessageType.Question) { this.isQuestion = true; }
    else { this.isQuestion = false; }
    

    if (this.messageType === MessageType.Question) { return 'question'; }
    else if (this.messageType === MessageType.Warning) { return 'warning'; }
    else if (this.messageType === MessageType.Error) { return 'error'; }
    return 'information';
  }
  confirm() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }

}
