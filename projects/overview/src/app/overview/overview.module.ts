import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import { RouterModule, Routes } from '@angular/router';

const path: Routes = [{ path: '', component: OverviewComponent }];
@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, OverviewRoutingModule, RouterModule.forChild(path)],
})
export class OverviewModule {}
