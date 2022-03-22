
import { DOCUMENT } from "@angular/common";
import { Component, Inject, Renderer2, ViewChild} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from "rxjs";

@Component({
  selector: "feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.css"],
})
export class FeedbackComponent {
  closeSubject: Subject<boolean> = new Subject();
  @ViewChild('modalTutorial',{static:true}) feedbackModal:any;
  public feedback;
  // private userData: IUser;
  demoId: any;
  demoName: any;
  
  overStar: number | undefined;
  rate = 0;
  constructor(
    private formBuilder: FormBuilder, private _renderer2: Renderer2,  @Inject(DOCUMENT) public document: Document,
    public bsModalRef: BsModalRef) {
    this.feedback = this.formBuilder.group({
      feedback: '',
      rate:0
    });

  }

  onSubmit(formData: any) {
    const feedback = formData['feedback'];
    const rate = formData['rate'];
    if(window && window['aptrinsic'] ){
      window['aptrinsic']('send', 'feedback', {
          "category": "General Feedback",
          "description": (feedback ? feedback : '-'),
          "subject": `Demo: ${this.demoName} | ${rate}`,
          'labels' : [`${rate}`]
       });
    }
    this.bsModalRef.hide();
  }

  validateForm(formData: any) {
    return (formData['rate'] === 0)
  }
  close(){
    this.bsModalRef.hide();
  }

  hoveringOver(value: number): void {
    this.overStar = value;
  }

  resetStar(): void {
    this.overStar = void 0;
  }
}
