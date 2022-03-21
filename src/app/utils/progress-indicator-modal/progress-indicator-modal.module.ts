import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RectangleSpinnerModule } from "../rectangle-spinner/rectangle-spinner.module";
import { ProgressIndicatorModalComponent } from "./progress-indicator-modal.component";
import { ProgressIndicatorService } from './progress-indicator.service';

@NgModule({
    imports: [
        CommonModule,
        RectangleSpinnerModule
    ],
    declarations: [
        ProgressIndicatorModalComponent
    ],
    entryComponents: [
        ProgressIndicatorModalComponent
    ],
    providers: [ProgressIndicatorService]
})
export class ProgressIndicatorModalModule {

}