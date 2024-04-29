import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PickupCallCardComponent } from '../components/pickup-call-card/pickup-call-card.component';

@NgModule({
    declarations: [PickupCallCardComponent],
    exports: [PickupCallCardComponent],
    imports: [CommonModule, FormsModule, IonicModule]
  })
  export class SharedModule {}