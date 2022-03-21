import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, Renderer2 } from "@angular/core";
import { DemoModel } from "../models/demo";
import { DemoService } from "../services/demo.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";

@Component({
  selector: "demolist",
  templateUrl: "./demolist.component.html",
  styleUrls: ["./demolist.component.css"],
})
export class DemoListComponents {
  public demos!: DemoModel[];

  public isLoading: boolean = true;

  public tutorialButton: any;

  constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document,
    public demoService: DemoService, public bsModalService: BsModalService, private router: Router) {
    this.loadDemos();
  }

  loadDemos(): void {
    this.isLoading = true;
    this.demoService.fetchDemos().subscribe((demos) => {
      this.demos = demos;
      this.arrangeDemosAlphabetically();
      this.demoService.setDemoOverview(this.demos);
      this.isLoading = false;
    });
  }

  arrangeDemosAlphabetically() {
    this.demos.sort((a, b) => a.name.localeCompare(b.name));
    let tempDemosAvailable: DemoModel[] = [];
    this.demos.forEach(element => {
      if (element.comingSoon == false && !element.underMaintenance) {
        tempDemosAvailable.push(element);
      }
    });
    this.demos.forEach(element => {
      if (tempDemosAvailable.indexOf(element) === -1) {
        tempDemosAvailable.push(element)
      }
    });
    this.demos = tempDemosAvailable;
  }

  demoClicked(demo: DemoModel) {
    if (demo.link) window.open(demo.link.startsWith("http") ? demo.link : "https://" + demo.link);
    if(window && window['aptrinsic'] ){
      window['aptrinsic']('track', 'gp_demoCatalog_demoPreview_clicked', {
          "demoName": demo.name
       });
    }
  }

  navigateToDetailPage(demo: DemoModel) {
    this.router.navigate(['/demos', demo.detailPage]);
  }
}
