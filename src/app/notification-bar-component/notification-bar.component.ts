import { Component, ViewEncapsulation } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { VersionInfo } from '../models/demo';
import { ProgressIndicatorModalComponent } from '../utils/progress-indicator-modal/progress-indicator-modal.component';
import packageInfo  from './../../../package.json';
import { DemoService } from '../services/demo.service';
import { ProgressIndicatorService } from '../utils/progress-indicator-modal/progress-indicator.service';
import { AlertMessageModalComponent } from '../utils/alert-message-modal/alert-message-modal.component';

@Component({
  selector: 'notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationBarComponent {
  public appVersion: string = packageInfo.version;
  newVersion: boolean | undefined;
  updateURL!: string | "";
  versionDetails!: VersionInfo;
  fileName!: string;
  private progressModal!: BsModalRef ;
//  userHasAdminRights: boolean;

  constructor(private demoService: DemoService, private modalService: BsModalService) {
    //this.userHasAdminRights = userService.hasRole(appStateService.currentUser.value, "ROLE_APPLICATION_MANAGEMENT_ADMIN")
   };

  ngOnInit() {
    this.loadVersionInfo();
  /*   if(this.userHasAdminRights) {
      this.loadVersionInfo();
    } */
  }

  loadVersionInfo() {
    this.demoService.fetchDemoListDetails().subscribe((version) => {
      this.versionDetails = version['versionInfo'];
      /* if (this.appVersion >= this.versionDetails.updateAvailable) {
        this.newVersion = false;
      } else {
        this.newVersion = true;
      }

      this.updateURL = this.versionDetails.updateURL;
      this.fileName = this.versionDetails.fileName; */
      this.demoService.setVersionInfo(this.versionDetails);
    });
  }
  async updateNewVersion() {
    const alertMessage = {
      title: 'Updation Confirmation',
      description: `Please confirm to proceed with the Demo Catalog Updation.`,
      type: 'info',
      alertType: 'confirm' //info|confirm
    }
    const installDemoDialogRef = this.alertModalDialog(alertMessage);
    await installDemoDialogRef.content.event.subscribe(async (data: { isConfirm: any; }) => {
      // console.log('Child component\'s event was triggered', data);
      if (data && data.isConfirm) {
        this.showProgressModalDialog('Updating Demo Catalog...');
        await this.demoService.updateDemoCatalog(this.updateURL, this.fileName);
        this.progressModal.hide();
        if(!this.demoService.errorReported) {
          const postUpdationMsg = {
            title: 'Updation Completed',
            description: 'Demo Catalog is successfully updated.',
            type: 'info',
            alertType: 'info' //info|confirm
          };
          const postUpdationDialogRef = this.alertModalDialog(postUpdationMsg);
          await postUpdationDialogRef.content.event.subscribe(() => {
            window.location.reload();
          });
        }
      }
    });
  }

  showProgressModalDialog(message: string): void {
    this.progressModal = this.modalService.show(ProgressIndicatorModalComponent, { class: 'c8y-wizard', initialState: { message } });
  }

  alertModalDialog(message: any): BsModalRef {
    return this.modalService.show(AlertMessageModalComponent, { class: 'c8y-wizard', initialState: { message } });
  }
}
