import { DocenteRoutingModule, routedComponents } from './docente-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { UbicacionesService } from '../../@core/data/ubicaciones.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    DocenteRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    UbicacionesService,
  ],
  exports: [
   
  ],
})
export class DocenteModule{}