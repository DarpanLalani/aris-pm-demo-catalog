import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from  'ng-gallery/lightbox';
import { NgImageSliderModule } from 'ng-image-slider';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoDetailComponent } from './demo-detail-component/demo-detail.component';
import { DemoOverviewComponent } from './demo-overview-component/demo-overview.component';
import { DemoListComponents } from './demoListComponent/demolist.component';
import { NotificationBarComponent } from './notification-bar-component/notification-bar.component';
import { AlertMessageModalModule } from './utils/alert-message-modal/alert-message-modal.module';
import { ProgressIndicatorModalModule } from './utils/progress-indicator-modal/progress-indicator-modal.module';
import { RectangleSpinnerModule } from './utils/rectangle-spinner/rectangle-spinner.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FeedbackComponent } from './feedbackComponent/feedback.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    DemoListComponents,
    DemoOverviewComponent,
    NotificationBarComponent,
    DemoDetailComponent,
    FeedbackComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RectangleSpinnerModule,
    ProgressIndicatorModalModule,
    AlertMessageModalModule,
    RatingModule.forRoot(),
    GalleryModule.withConfig({ }),
    LightboxModule.withConfig({ }),
    NgImageSliderModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
