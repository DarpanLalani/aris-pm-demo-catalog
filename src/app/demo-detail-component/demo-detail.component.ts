import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
// import { DemoManagementService } from '../demo-management/services/demo-management.service';
import { DemoService } from '../services/demo.service';
import { DemoDetails } from './demo-detail.model';
import { ProgressIndicatorModalComponent } from '../utils/progress-indicator-modal/progress-indicator-modal.component';
import { AlertMessageModalComponent } from '../utils/alert-message-modal/alert-message-modal.component';
import { DemoModel } from '../models/demo';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
// import { getAuthentication } from "./../demo-management/utils/utils";
import paclageInfo from '../../../package.json';
import { FeedbackComponent } from '../feedbackComponent/feedback.component';

@Component({
  selector: 'demodetail',
  templateUrl: './demo-detail.component.html',
  styleUrls: ['./demo-detail.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DemoDetailComponent implements OnInit {


  public galleryImages!: GalleryItem[];
  public videos: any = [];
  public isBusy = false;

  id: string| null = '';

  public demoDetails: DemoDetails = {};

  public isInstalled = false;

  public versionInstalled = '';

  private progressModal!: BsModalRef;

  private demoOverviewObject: DemoModel | null | undefined;

  private isCepAppSubscribed = false;

  private readonly VERIFY_ALL_ROLES = [
    "ROLE_IDENTITY_ADMIN",
    "ROLE_INVENTORY_ADMIN",
    "ROLE_APPLICATION_MANAGEMENT_ADMIN",
    "ROLE_APPLICATION_MANAGEMENT_READ",
    "ROLE_USER_MANAGEMENT_ADMIN"];

  private readonly VERIFY_ANY_ROLES = [
    "ROLE_CEP_MANAGEMENT_ADMIN",
    "ROLE_SMARTRULE_ADMIN"
  ];
  applicationDetails!: any[];
  tenantId = '';
  appVersion!: string;

  constructor(private demoService: DemoService, private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService, public gallery: Gallery) { }

  ngOnInit() {
   // this.tenantId = getAuthentication().tenant;
    this.initDemoId();
    this.loadDemoDetails();
    this.appVersion = paclageInfo.version;
    if (!this.demoService.getVersionInfo()) {
      this.demoService.fetchDemoListDetails().subscribe((version) => {
        this.demoService.setVersionInfo(version['versionInfo']);
      });
    }
  }

  initDemoId() {
    if (!this.route.snapshot.paramMap.has('id')) {
      console.error('Missing id in URL');
      return;
    }

    this.id = this.route.snapshot.paramMap.get('id');
  }

  loadDemoDetails() {
    if (!this.id) {
      console.error('Missing id to load demo details!');
      return;
    }


    this.demoService.fetchDemoDetails(this.id).subscribe((demoDetails: DemoDetails) => {
      // console.log(demoDetails);
      this.demoDetails = demoDetails;

      this.demoOverviewObject = this.demoService.getDemoOverviewObject(this.id)
      if (this.demoOverviewObject == null) {
        this.demoService.fetchDemos().subscribe(demos => {
          this.demoService.setDemoOverview(demos);
          this.demoOverviewObject = this.demoService.getDemoOverviewObject(this.id)
          this.demoDetails.comingSoon = this.demoOverviewObject?.comingSoon;
          this.demoDetails.underMaintenance = this.demoOverviewObject?.underMaintenance;
        });
      } else {
        this.demoDetails.comingSoon = this.demoOverviewObject.comingSoon;
        this.demoDetails.underMaintenance = this.demoOverviewObject.underMaintenance;
      }
      this.initImageGallery();
      /* this.demoManagementService.getDemoFromConfiguration(this.demoDetails.id).then((demoConfiguration) => {
        this.initImageGallery();

        if (!demoConfiguration) {
          return;
        }

        this.isInstalled = demoConfiguration.hasOwnProperty('isInstalled') && demoConfiguration['isInstalled'];
        this.versionInstalled = demoConfiguration.hasOwnProperty('version') && demoConfiguration['version'];
      }) */

    });

  }

  initImageGallery() {
    if (!this.demoDetails || !this.demoDetails.assets
      || !this.demoDetails.assets.images) {
      return;
    }

    const images: string[] = this.demoDetails.assets.images;
    // Creat gallery items
    // this.galleryImages = images;
    this.galleryImages = images.map(item => new ImageItem({ src: item, thumb: item }));
    //this.galleryImages = images.map(image => ({ small: image, medium: image, big: image }));

    this.videos = this.demoDetails.assets.videos;
  }

  isDemoPreviewable(): boolean {
    return this.demoDetails?.meta?.preview != undefined && this.demoDetails.meta.preview.length > 0;
  }

  isDemoInstallable(): boolean {
    return this.demoDetails?.meta?.archive != undefined && this.demoDetails.meta.archive.length > 0 && !this.isDemoInExceptionList();
  }
  isForceUpgrade(): boolean {
    if (this.demoService.getVersionInfo() && this.demoService.getVersionInfo()!.updateAvailable) {
      const updateAvailable = this.demoService.getVersionInfo()!.updateAvailable;
      if (this.demoDetails?.meta?.forceUpgrade && (this.appVersion < (updateAvailable as string))) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    
  }
  private isDemoInExceptionList() {
    const currentHost = window.location.host;
    if (this.demoDetails?.meta?.exceptionHost && this.demoDetails.meta.exceptionHost.length > 0) {
      return (this.demoDetails.meta.exceptionHost.indexOf(currentHost) !== -1);
    }
    return false;
  }

  isDemoInstalled(): boolean {
    return this.isInstalled;
  }

  async installDemo() {
    /* if (this.userService.hasAllRoles(this.appStateService.currentUser.value, this.VERIFY_ALL_ROLES) &&
      this.userService.hasAnyRole(this.appStateService.currentUser.value, this.VERIFY_ANY_ROLES)) {
      this.isBusy = true;
      await this.verifyCEPApp();
      this.isBusy = false;
      if (this.isCepAppSubscribed) {
        if (this.demoManagementService.getAppBuilderVersion() >= '1.3.0') {
          const alertMessage = {
            title: 'Installation Confirmation',
            description: `Application builder  v${this.demoManagementService.getAppBuilderVersion()} detected. Please confirm to proceed with the installation.`,
            type: 'info',
            alertType: 'confirm' //info|confirm
          }
          const installDemoDialogRef = this.alertModalDialog(alertMessage);
          await installDemoDialogRef.content.event.subscribe(async data => {
            // console.log('Child component\'s event was triggered', data);
            if (data && data.isConfirm) {
              this.showProgressModalDialog('Installing Demo ...');
              if (window && window['aptrinsic']) {
                window['aptrinsic']('track', 'gp_demoCatalog_demoInstall_clicked', {
                  "demoId": this.demoDetails.id,
                  "demoName": this.demoDetails.name,
                  "tenantId": this.tenantId
                });
              }
              await this.demoService.installDemo(this.demoDetails);
              // Give cumulocity a chance to load the file
              //   console.log('waiting to finish installatoin process...');
              await new Promise<void>((resolve => setTimeout(() => resolve(), 5000)));
              this.progressModal.hide();
              //   console.log('Installation completed');
              if (this.demoDetails.meta.postInstallationMsg && this.demoDetails.meta.postInstallationMsg !== '') {
                const postInstallationMsg = {
                  title: 'Installation Completed',
                  description: this.demoDetails.meta.postInstallationMsg,
                  type: 'info',
                  alertType: 'info' //info|confirm
                };
                const postInstalledDialogRef = this.alertModalDialog(postInstallationMsg);
                await postInstalledDialogRef.content.event.subscribe(data => {
                  location.reload();
                });
              } else {
                location.reload();
              }
            }
          });
        } else {
          let appBuilderSupportedVersions = [];
          if (this.demoDetails.meta && this.demoDetails.meta.supportedAppBuilder) {
            appBuilderSupportedVersions = this.demoDetails.meta.supportedAppBuilder.split(',');
          }

          const alertMessage = {
            title: 'Installation Confirmation',
            description: `Please verify that you are using one of below version of Application builder.`,
            type: 'info',
            alertType: 'confirm' //info|confirm
          }
          const installDemoDialogRef = this.alertModalDialog(alertMessage, appBuilderSupportedVersions);
          await installDemoDialogRef.content.event.subscribe(async data => {
            // console.log('Child component\'s event was triggered', data);
            if (data && data.isConfirm) {
              this.showProgressModalDialog('Installing Demo ...');
              if (window && window['aptrinsic']) {
                window['aptrinsic']('track', 'gp_demoCatalog_demoInstall_clicked', {
                  "demoId": this.demoDetails.id,
                  "demoName": this.demoDetails.name,
                  "tenantId": this.tenantId
                });
              }
              await this.demoService.installDemo(this.demoDetails);
              // Give cumulocity a chance to load the file
              //   console.log('waiting to finish installatoin process...');
              await new Promise<void>((resolve => setTimeout(() => resolve(), 5000)));
              this.progressModal.hide();
              //   console.log('Installation completed');
              if (this.demoDetails.meta.postInstallationMsg && this.demoDetails.meta.postInstallationMsg !== '') {
                const postInstallationMsg = {
                  title: 'Installation Completed',
                  description: this.demoDetails.meta.postInstallationMsg,
                  type: 'info',
                  alertType: 'info' //info|confirm
                };
                const postInstalledDialogRef = this.alertModalDialog(postInstallationMsg);
                await postInstalledDialogRef.content.event.subscribe(data => {
                  location.reload();
                });
              } else {
                location.reload();
              }
            }
          });
        }

      } else {
        const alertMessage = {
          title: 'Microservice cep not found!',
          description: `Please subscribe microservice cep(actionApama-ctrl-starter) to perform this action!`,
          type: 'danger',
          alertType: 'info' //info|confirm
        }
        this.alertModalDialog(alertMessage);
      }

    } else {
      const alertMessage = {
        title: 'Access Denied!',
        description: `You don't have enough permissions to perform this action!`,
        type: 'danger',
        alertType: 'info' //info|confirm
      }
      this.alertModalDialog(alertMessage);
    } */

  }

  private async verifyCEPApp() {
    /* this.applicationDetails = await this.demoManagementService.getAppListDetails();
    if (this.applicationDetails && this.applicationDetails.length > 0) {
      const cepAPP = this.applicationDetails.find(app => app.contextPath === 'cep');
      if (cepAPP) { this.isCepAppSubscribed = true; }
      else { this.isCepAppSubscribed = false; }
    } */
  }

  deleteDemo() {
    /* if (this.userService.hasAllRoles(this.appStateService.currentUser.value, this.VERIFY_ALL_ROLES) &&
      this.userService.hasAnyRole(this.appStateService.currentUser.value, this.VERIFY_ANY_ROLES)) {
      const alertMessage = {
        title: 'Deletion Confirmation',
        description: `You are about to delete all assets (except runtime widgets) which are created during installation.`,
        type: 'danger',
        alertType: 'confirm' //info|confirm
      }
      const deleteDemoDialogRef = this.alertModalDialog(alertMessage);
      deleteDemoDialogRef.content.event.subscribe((data: any) => {
        if (data && data.isConfirm) {
          if (window && window['aptrinsic']) {
            window['aptrinsic']('track', 'gp_demoCatalog_demoDelete_clicked', {
              "demoId": this.demoDetails.id,
              "demoName": this.demoDetails.name,
              "tenantId": this.tenantId
            });
          }
          this.showProgressModalDialog('Deleting Demo ...');
          this.demoService.deleteDemo(this.demoDetails).then(() => {
            location.reload();
          });
        }
      });
    } else {
      const alertMessage = {
        title: 'Access Denied!',
        description: `You don't have enough permissions to perform this action!`,
        type: 'danger',
        alertType: 'info' //info|confirm
      }
      this.alertModalDialog(alertMessage);
    } */
  }

  openPreview() {
    if (!this.demoDetails?.meta?.preview) {
      console.error('Missing preview link');
      return;
    }
    if (window && window['aptrinsic']) {
      window['aptrinsic']('track', 'gp_demoCatalog_demoPreview_clicked', {
        "demoId": this.demoDetails.id,
        "demoName": this.demoDetails.name,
        "tenantId": this.tenantId
      });
    }
    window.open(this.demoDetails.meta.preview, "_blank");
  }

  showProgressModalDialog(message: string): void {
    this.progressModal = this.modalService.show(ProgressIndicatorModalComponent, { class: 'c8y-wizard', initialState: { message } });
  }

  alertModalDialog(message: any, appBuilderSupportedVersions?: any): BsModalRef {
    return this.modalService.show(AlertMessageModalComponent, { class: 'c8y-wizard', initialState: { message, appBuilderSupportedVersions } });
  }

  hideProgressModalDialog(): void {
    this.progressModal.hide();
  }

  navigateToDemoCatalog() {
    this.router.navigate(['/overview']);
  }

  openLink(type: string) {
    if (type === 'forum') {
      window.open('https://tech.forums.softwareag.com/tag/Cumulocity-IoT');
    }
  }

  feedback() {
     if(window && window['aptrinsic'] ){
       window['aptrinsic']('track', 'gp_demoCatalog_giveFeedback_clicked',  {
         "demoId": this.demoDetails.id,
         "demoName": this.demoDetails.name
       });
     }
    const modalRef = this.modalService.show(FeedbackComponent, { initialState: { demoId: this.demoDetails.id, demoName: this.demoDetails.name } });
    modalRef.content?.closeSubject.subscribe((result) => {
      //      console.log("Feedback Popover: " + result);
    });
  }
  showInterest() {
    if (window && window['aptrinsic']) {
      window['aptrinsic']('track', 'gp_demoCatalog_demoInterested_clicked', {
        "demoId": this.demoDetails.id,
        "demoName": this.demoDetails.name,
        "tenantId": this.tenantId
      });
    }
    const alertMessage = {
      title: 'Thank you!',
      description: `Your interest is submitted successfully.`,
      type: 'info',
      alertType: 'info' //info|confirm
    }
    this.alertModalDialog(alertMessage);
  }

  async updateDemoCatalog() {
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
        await this.demoService.updateDemoCatalog(this.demoService.getVersionInfo()?.updateURL, this.demoService.getVersionInfo()?.fileName);
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
}