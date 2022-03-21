import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RectangleSpinnerComponent } from "./rectangle-spinner.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        RectangleSpinnerComponent
    ],
    exports: [
        RectangleSpinnerComponent
    ]
})
export class RectangleSpinnerModule { }