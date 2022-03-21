import { DOCUMENT } from "@angular/common";
import { Component, Inject, Renderer2, ViewEncapsulation } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";

//const { version: appVersion } = require('../../package.json');

@Component({
    selector: 'demo-overview',
    templateUrl: './demo-overview.component.html',
    styleUrls: ['./styles.less']
})
export class DemoOverviewComponent {

  //  public appVersion: string = version;

 //   private userData: IUser;

    constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document,
        private bsModalService: BsModalService) {
        // getting user info
      /*   userInfoService.current().then((data) => {
            this.appVersion = appVersion;
            this.userData = data.data;
            this.initGainsight(); // initializing gainsight tracking api
            if (this.isFirstTimeUser()) {
                this.startTutorial();
            }
        }); */
    }

    /* initGainsight() {
        let script = this._renderer2.createElement("script");
        script.type = `text/javascript`;
        script.text =
            `
            (function(n,t,a,e,co){var i="aptrinsic";n[i]=n[i]||function(){
              (n[i].q=n[i].q||[]).push(arguments)},n[i].p=e;n[i].c=co;
            var r=t.createElement("script");r.async=!0,r.src=a+"?a="+e;
            var c=t.getElementsByTagName("script")[0];c.parentNode.insertBefore(r,c)
          })(window,document,"https://web-sdk.aptrinsic.com/api/aptrinsic.js","AP-98W68BOG3KCQ-2-4");
          ` +
            `
    
    
          aptrinsic("identify",
          {
          //User Fields
          "id": ` +
            `"` +
            this.userData.id +
            `", // Required for logged in app users
          "email": ` +
            `"` +
            this.userData.email +
            `",
          "firstName": ` +
            `"` +
            this.userData.firstName +
            `",
          "lastName": ` +
            `"` +
            this.userData.lastName +
            `"
          },
          {
          //Account Fields
          "id": "demo-catalog", //Required
          "name":"Demo Catalog"
          });
            `;

        this._renderer2.appendChild(this._document.body, script);
    }

    public isFirstTimeUser(): boolean {
        let tempUser: IUser = this.userData;

        // if it does exist or is set to false then user is not first time user
        if (tempUser.customProperties.isFirstTimeUser != null && tempUser.customProperties.isFirstTimeUser == false) {
            return false;
        }
        // if it does not exist user is a first time user
        if (tempUser.customProperties.isFirstTimeUser == null) {
            tempUser.customProperties = { isFirstTimeUser: false };
        } else {
            tempUser.customProperties.isFirstTimeUser = false;
        }
        this.userInfoService.updateCurrent(tempUser).then((data) => {
            this.userData = data.data;
        });
        return true;
    }

    startTutorial() {
        let script = this._renderer2.createElement("script");
        script.type = `text/javascript`;
        script.text =
            `aptrinsic('track', 'Instructions used', {"userName":"` +
            this.userData.displayName +
            `"}); `;

        this._renderer2.appendChild(this._document.body, script);
    }

    openFeedbackModal() {
        const modalRef = this.bsModalService.show(FeedbackComponent);
        modalRef.content.closeSubject.subscribe((result) => {
        });
    } */
}