import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DemoModel, VersionInfo } from "../models/demo";
import { map } from 'rxjs/operators';
import { DemoDetails } from "../demo-detail-component/demo-detail.model";
// import { DemoManagementService } from "../demo-management/services/demo-management.service";
// import { getAuthentication } from '../demo-management/utils/utils';
// import * as JSZip from "jszip";
import { ProgressIndicatorService } from '../utils/progress-indicator-modal/progress-indicator.service';

@Injectable({
  providedIn: 'root',
})
export class DemoService {

  tenantId = '';
  errorReported = false;
  constructor(private http: HttpClient, 
    private progressIndicatorService: ProgressIndicatorService) { 
     // this.tenantId = getAuthentication().tenant;
    }

  
  private readonly GATEWAY_URL = './assets/demoCatalog';
  private readonly CATALOG_LABCASE_ID = '/catalog.json'; // For Development
  private demoListOverview: DemoModel[] = [];
  private versionInfo: VersionInfo | undefined | null;


  private readonly HTTP_HEADERS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  fetchDemos(): Observable<DemoModel[]> {
      return this.fetchDemoListDetails().pipe(map(response => response['demos'].map((d: { name: any; link: any; thumbnail: any; description: any; comingSoon: any; underMaintenance: any; detailPage: any; }): DemoModel => ({
        name: d.name,
        link: d.link,
        thumbnail: d.thumbnail,
        description: d.description,
        comingSoon: d.comingSoon,
        underMaintenance: d.underMaintenance,
        detailPage: d.detailPage
      }))));
  }

  fetchDemoListDetails(): Observable<any> {
    return this.http.get<any>(`${this.GATEWAY_URL}${this.CATALOG_LABCASE_ID}`, this.HTTP_HEADERS);
  }

  fetchDemoDetails(id: string): Observable<DemoDetails> {
    return this.http.get<DemoDetails>(`${this.GATEWAY_URL}${id}`, this.HTTP_HEADERS);
  }

  async installDemo(demo: DemoDetails): Promise<void> {
    if (!demo || !demo?.meta?.archive) {
      console.error('Missing link to archive');
      return;
    }

   /*  const data: ArrayBuffer = await this.downloadBinary(demo.meta.archive);
    const blob = new Blob([data], {
      type: 'application/zip'
    }); */

  //  await this.demoManagementService.installDemo(blob, demo);
  }

  async deleteDemo(demo: DemoDetails): Promise<void> {
   /*  let isCookieAuth = false;
        let cookieAuth = null;
        const token = localStorage.getItem(this.loginService.TOKEN_KEY) || sessionStorage.getItem(this.loginService.TOKEN_KEY);
        if (!token) {
            // CookieAuth token required by demo catalog for SSO use specifically for Smart Rule
            cookieAuth = new CookieAuth();
            cookieAuth.updateCredentials(getAuthentication());
            isCookieAuth = true;
        }

    await this.demoManagementService.deleteDemo(demo, false, isCookieAuth, cookieAuth);
    return this.demoManagementService.updateGlobalConfiguration(demo, false); */
  }

/*   private downloadBinary(binaryId: string): Promise<ArrayBuffer> {
    return this.http.get(`${this.GATEWAY_URL}${binaryId}`, {
      responseType: 'arraybuffer'
    }).toPromise();
  } */

  getDemoOverviewObject(id: string| null) {
    if(this.demoListOverview && this.demoListOverview.length > 0) {
      return this.demoListOverview.find((demo: DemoModel ) => demo.detailPage === id);
    }
    return null;
  }

  setDemoOverview(demos: DemoModel[]) {
    this.demoListOverview = demos;
  }

  setVersionInfo(versionInfo: VersionInfo) {
    this.versionInfo = versionInfo;
  }

  getVersionInfo() {
    return this.versionInfo;
  }

  async updateDemoCatalog(binaryLocation: any, fileName: any) {
    /* if (!binaryLocation) {
      console.error('Missing link to download binary');
      this.alertService.danger("Missing link to download binary");
      this.errorReported = true;
      return;
    }
    this.progressIndicatorService.setProgress(20);
    const data: ArrayBuffer = await this.downloadBinary(binaryLocation);
    const blob = new Blob([data], {
      type: 'application/zip'
    });
    const binaryFile = new File([blob], fileName, { type: "'application/zip'" })
    this.progressIndicatorService.setProgress(30);
    let demoCatalogC8yJson;
        try {
            this.progressIndicatorService.setProgress(40);
            const widgetFileZip = await JSZip.loadAsync(binaryFile);
            demoCatalogC8yJson = JSON.parse(await widgetFileZip.file('cumulocity.json').async("text"));
            if (demoCatalogC8yJson.contextPath === undefined) {
              this.alertService.danger("Unable to download new version.");
              this.errorReported = true;
              throw Error("Demo Catalog Context Path not found");
            }
        } catch (e) {
            console.log(e);
            this.alertService.danger("Unable to download new version.");
            this.errorReported = true;
            throw Error("Not a Binary");
        }

    await this.updateDemoApp(binaryFile, demoCatalogC8yJson);
 */  }

  private async updateDemoApp(binaryFile: any, demoCatalogC8yJson: any) {
    /* const appList = await this.demoManagementService.getAppListDetails();
    // const demoApp = appList.find(app => app.contextPath === demoCatalogC8yJson.contextPath);
    let demoApp = appList.find(app => app.contextPath === demoCatalogC8yJson.contextPath &&  (String(app.availability) === 'PRIVATE'));
    if(!demoApp) {
      // Checking subscibed App.
      demoApp = appList.find(app => app.contextPath === demoCatalogC8yJson.contextPath  );
    }
    const demoAppTenantId = (demoApp && demoApp.owner && demoApp.owner.tenant ? demoApp.owner.tenant.id : undefined);
    if(demoApp && demoAppTenantId === this.tenantId) {
      this.progressIndicatorService.setProgress(50);
      // Upload the binary
      const appBinary = (await this.appService.binary(demoApp).upload(binaryFile)).data;
      this.progressIndicatorService.setProgress(60);
      // Update the app
       await this.appService.update({
          ...demoCatalogC8yJson,
          id: demoApp.id,
          activeVersionId: appBinary.id.toString()
      });
      this.progressIndicatorService.setProgress(70);
      if(window && window['aptrinsic'] ){
          window['aptrinsic']('track', 'gp_demo_catalog_updated', {
              "democatalog": demoApp.name,
              "tenantId": this.tenantId
          });
      }
    } else {
      this.alertService.danger("Unable to upgrade Demo Catalog!", "Demo Catalog can't be upgraded from subscribed application.")
      this.errorReported = true;
      return;
    }
    this.progressIndicatorService.setProgress(80);*/
  } 
}