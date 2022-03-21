import { Component, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subscription } from 'rxjs';
import { ProgressIndicatorService } from './progress-indicator.service';

@Component({
    selector: 'progress-indicator-modal',
    templateUrl: './progress-indicator-modal.component.html',
    styleUrls: ['./styles.less'],
    encapsulation: ViewEncapsulation.None,
})
export class ProgressIndicatorModalComponent implements OnDestroy{

    progressSub: Subscription;
    constructor(private progressIndicatorService: ProgressIndicatorService) {
        this.progressSub = this.progressIndicatorService.progress$.subscribe( (v: any) => {
            this.progressStatus = v + '%';
        })
    }

    message: string | undefined;
    progressStatus = '5%';

    ngOnDestroy(): void {
        this.progressSub.unsubscribe();
    }
}