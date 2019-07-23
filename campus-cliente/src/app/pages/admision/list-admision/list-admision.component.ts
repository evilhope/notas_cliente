import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { AdmisionesService } from '../../../@core/data/admisiones.service';
import { ProgramaAcademicoService } from '../../../@core/data/programa_academico.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-list-admision',
  templateUrl: './list-admision.component.html',
  styleUrls: ['./list-admision.component.scss'],
  })
export class ListAdmisionComponent implements OnInit {
  uid: number;
  cambiotab: boolean = false;
  config: ToasterConfig;
  settings: any;
  posgrados = [];
  selectedValue: any;

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private admisionesService: AdmisionesService,
    private toasterService: ToasterService,
    private programaService: ProgramaAcademicoService) {
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
    this.loadInfoPostgrados();
  }

  cargarCampos() {
    this.settings = {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      mode: 'external',
      columns: {
        Aspirante: {
          title: this.translate.instant('GLOBAL.aspirante'),
          // type: 'number;',
          valuePrepareFunction: (value) => {
            return value;
          },
        },
        ProgramaAcademico: {
          title: this.translate.instant('GLOBAL.programa_academico'),
          // type: 'number;',
          valuePrepareFunction: (value) => {
            const num = parseInt(value, 10);
            return this.posgrados[num - 1].Nombre.toString();
          },
        },
        Periodo: {
          title: this.translate.instant('GLOBAL.periodo'),
          // type: 'number;',
          valuePrepareFunction: (value) => {
            return value;
          },
        },
        EstadoAdmision: {
          title: this.translate.instant('GLOBAL.estado_admision'),
          // type: 'estado_admision;',
          valuePrepareFunction: (value) => {
            return value.Nombre;
          },
        },
        Enfasis: {
          title: 'Enfasis',
          // type: 'estado_admision;',
          valuePrepareFunction: (value) => {
            return value.Nombre;
          },
        },
        AceptaTerminos: {
          title: 'Acepta Terminos',
          // type: 'estado_admision;',
          valuePrepareFunction: (value) => {
            return value;
          },
        },
      },
    };
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(query?: string): void {
    if (query) {
      this.admisionesService.get(query).subscribe(res => {
        if (res !== null) {
          const data = <Array<any>>res;
          this.source.load(data);
            } else {
              Swal({
                type: 'info',
                title: this.translate.instant('GLOBAL.warning'),
                text: `no se encontraron resultados`,
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            }
      },
      (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
    } else {
      this.admisionesService.get('admision/?limit=0').subscribe(res => {
        if (res !== null) {
          const data = <Array<any>>res;
          this.source.load(data);
            }
      },
      (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
    }
  }

  ngOnInit() {
  }

  onEdit(event): void {
    this.uid = event.data.Id;
    this.activetab();
  }

  onCreate(event): void {
    this.uid = 0;
    this.activetab();
  }

  onDelete(event): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.eliminar'),
      text: this.translate.instant('GLOBAL.eliminar') + '?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
    };
    Swal(opt)
    .then((willDelete) => {
      if (willDelete.value) {
        this.admisionesService.delete('admision/', event.data).subscribe(res => {
          if (res !== null) {
            this.loadData();
            this.showToast('info', this.translate.instant('GLOBAL.eliminar'),
            this.translate.instant('GLOBAL.admision') + ' ' +
            this.translate.instant('GLOBAL.confirmarEliminar'));
            }
         },
         (error: HttpErrorResponse) => {
           Swal({
             type: 'error',
             title: error.status + '',
             text: this.translate.instant('ERROR.' + error.status),
             confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
           });
         });
      }
    });
  }

  activetab(): void {
    this.cambiotab = !this.cambiotab;
  }

  selectTab(event): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.lista')) {
      this.cambiotab = false;
    } else {
      this.cambiotab = true;
    }
  }

  onChange(event) {
    if (event) {
      this.loadData();
      this.cambiotab = !this.cambiotab;
    }
  }

  itemselec(event): void {
    // console.log("afssaf");
  }

  loadInfoPostgrados() {
    this.programaService.get('programa_academico/?limit=0')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.posgrados = <any>res;
          this.loadData();
        }
      },
      (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
  }

  Filtrar() {
    if (this.selectedValue) {
      this.loadData(`admision/?query=ProgramaAcademico:${this.selectedValue.Id}`);
    }else {
      this.loadData();
    }
  }

  ClearFiltro() {
    this.loadData();
    this.selectedValue = '--Seleccionar--'
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: type, // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

}
