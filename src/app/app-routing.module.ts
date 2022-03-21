import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoDetailComponent } from './demo-detail-component/demo-detail.component';
import { DemoOverviewComponent } from './demo-overview-component/demo-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: DemoOverviewComponent
  },
  {
    path: 'demos/:id',
    component: DemoDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
