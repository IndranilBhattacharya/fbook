import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemixIconModule } from 'angular-remix-icon';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NetworkDetailComponent } from '../../components/my-networks/network-detail/network-detail.component';
import { iconsConfig } from '../../constants/icon.config';
import { defaultToolTipConfig } from '../../constants/tooltip.config';

@NgModule({
  declarations: [NetworkDetailComponent],
  exports: [NetworkDetailComponent],
  imports: [
    CommonModule,
    RemixIconModule.configure(iconsConfig),
    TooltipModule.forRoot(defaultToolTipConfig),
  ],
})
export class SharedComponentsModule {}
