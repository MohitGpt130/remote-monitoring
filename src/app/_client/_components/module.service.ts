import { Injectable, NgModule, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import {
  NavigationStart,
  Router,
  Event,
  NavigationEnd,
  NavigationError,
  RouteConfigLoadEnd,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  connectionsCountObserver: Observer<number>;
  connectionState: Observer<boolean>;
  apiServer: Observer<string>;
  apiConfigsObserver: Observer<any>;
  apiConfigs;
  dashboardSetupConfigs;
  companySetupConfigs;
  companySetup;

  users;

  currentUser;
  accessibleLines = [];
  accessibleRoutes;
  countriesPrivileges;

  menus = {
    PDA: {
      Landing: {},
      Plants: {},
      Lines: {
        TabularView: {
          ViewCountNDurationButtons: null,
          ClickCountNDurationButtons: null,
        },
        ChartsView: {
          ViewEventChart: null,
          ViewPieCharts: null,
          ClickEventChartBar: null,
          GetEventChartBarCommentForm: null,
          GetVideoOnFault: null,
        },
      },
    },
    DataAnalytics: {
      LineView: {
        LineView: {
          GetShiftEndForm: null,
          GetRejectQuanityForm: null,
        },
        TabularView: {
          TabularView: null,
          ViewCountNDurationButtons: null,
          clickCountNDurationButtons: null,
        },
        ChartsView: {
          ViewEventChart: null,
          ViewPieCharts: null,
          ClickEventChartBar: null,
          GetEventChartBarCommentForm: null,
          GetVideoOnFault: null,
        },
      },
    },
    Masters: {
      CompanyMaster: {
        CompanymasterComponent: {
          ViewComponent: null,
        },
      },
      CountryMaster: {
        CountrymasterComponent: {
          ViewComponent: null,
        },
      },
      StateMaster: {
        StatemasterComponent: {
          ViewComponent: null,
        },
      },
      LocationMaster: {
        LocationmasterComponent: {
          ViewComponent: null,
        },
      },
      PlantMaster: {
        PlantmasterComponent: {
          ViewComponent: null,
        },
      },
      LineMaster: {
        LinemasterComponent: {
          ViewComponent: null,
        },
      },
      EquipmentMaster: {
        EquipmentComponent: {
          ViewComponent: null,
        },
      },
      SKUMaster: {
        SkumasterComponent: {
          ViewComponent: null,
        },
      },
      ShiftMaster: {
        ShiftmasterComponent: {
          ViewComponent: null,
        },
      },
      FaultcauseMaster: {
        FaultcausemasterComponent: {
          ViewComponent: null,
        },
      },
      OthercauseMaster: {
        OthercausemasterComponent: {
          ViewComponent: null,
        },
      },
      PlantDownMaster: {
        PlantdowntimemasterComponent: {
          ViewComponent: null,
        },
      },
    },
    Reports: {
      DaywiseReport: {
        ManageReport: {
          View: null,
        },
      },
      ShiftWiseReport: {
        ManageReport: {
          View: null,
        },
      },
      FaultcauseReport: {
        ManageReport: {
          View: null,
        },
      },
    },
  };

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.getDashboardSetupConfigs().then((data) => this.dashboardSetupConfigs);
    this.getCompanySetupConfigs().then((data) => this.companySetupConfigs);

    this.getConfigs();
  }
  configs: any;

  getConfigs() {
    this.httpClient
      .get<any>('configs/apix/apis.config.json')
      .subscribe((data) => (this.configs = data));
  }

  getCountryPrivileges() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (
      this.currentUser &&
      this.currentUser.roles &&
      this.currentUser.privileges
    ) {
      this.countriesPrivileges = this.currentUser.privileges;
    }
    return this.countriesPrivileges;
  }

  getLinePrivileges() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (
      this.currentUser &&
      this.currentUser.roles &&
      this.currentUser.privileges
    ) {
      for (const c in this.currentUser.privileges) {
        if (this.currentUser.privileges.hasOwnProperty(c)) {
          const company = this.currentUser.privileges[c];
          for (const co in company) {
            if (company.hasOwnProperty(co)) {
              const country = company[co];
              for (const s in country) {
                if (country.hasOwnProperty(s)) {
                  const state = country[s];
                  for (const l in state) {
                    if (state.hasOwnProperty(l)) {
                      const location = state[l];
                      for (const p in location) {
                        if (location.hasOwnProperty(p)) {
                          const plant = location[p];
                          this.accessibleLines.push(plant);
                          for (const li in plant) {
                            if (plant.hasOwnProperty(li)) {
                              const line = plant[li];
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return this.accessibleLines;
  }

  getDashboardPrivileges() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser && this.currentUser.roles.length > 0) {
      this.accessibleRoutes = this.currentUser.roles[0].privileges.menus;
    }
    return this.accessibleRoutes;
  }

  async getCompanySetupConfigs() {
    await this.httpClient
      .get('configs/apix/company-setup.json')
      .subscribe((company: any) => {
        this.companySetupConfigs = company;
        this.companySetup = {};
        company.countries.forEach((country) => {
          this.companySetup[country.country_code] = {};
          country.states.forEach((state) => {
            this.companySetup[country.country_code][state.state_code] = {};
            state.locations.forEach((location) => {
              this.companySetup[country.country_code][state.state_code][
                location.location_code
              ] = {};
              location.plants.forEach((plant) => {
                this.companySetup[country.country_code][state.state_code][
                  location.location_code
                ][plant.plant_code] = {};
                plant.lines.forEach((line) => {
                  this.companySetup[country.country_code][state.state_code][
                    location.location_code
                  ][plant.plant_code][line.line_code] = {};
                  if (line.equipments.length > 0) {
                    line.equipments.forEach((machine) => {
                      if (
                        this.companySetup[country.country_code][
                          state.state_code
                        ][location.location_code][plant.plant_code][
                          line.line_code
                        ].machines === undefined
                      ) {
                        this.companySetup[country.country_code][
                          state.state_code
                        ][location.location_code][plant.plant_code][
                          line.line_code
                        ].machines = {};
                      }
                      this.companySetup[country.country_code][state.state_code][
                        location.location_code
                      ][plant.plant_code][line.line_code].machines[
                        machine.equipment_name
                      ] = null;
                    });
                  }

                  if (line.skus.length > 0) {
                    line.skus.forEach((sku) => {
                      if (
                        this.companySetup[country.country_code][
                          state.state_code
                        ][location.location_code][plant.plant_code][
                          line.line_code
                        ].machines === undefined
                      ) {
                        this.companySetup[country.country_code][
                          state.state_code
                        ][location.location_code][plant.plant_code][
                          line.line_code
                        ].machines = {};
                      }
                      this.companySetup[country.country_code][state.state_code][
                        location.location_code
                      ][plant.plant_code][line.line_code].machines[
                        sku.sku_name
                      ] = {};
                      // if(sku.equipments.length>0)
                      // sku.equipments.forEach(skuMachine => {
                      //   this.companySetup[country.country_code][state.state_code][location.location_code][plant.plant_code][line.line_code]['skus'][sku.equipment_name][skuMachine.equipment_name] = null;
                      // });
                    });
                  }
                  if (line.shifts.length > 0) {
                    line.shifts.forEach((shift) => {
                      if (
                        this.companySetup[country.country_code][
                          state.state_code
                        ][location.location_code][plant.plant_code][
                          line.line_code
                        ].shifts === undefined
                      ) {
                        this.companySetup[country.country_code][
                          state.state_code
                        ][location.location_code][plant.plant_code][
                          line.line_code
                        ].shifts = {};
                      }
                      this.companySetup[country.country_code][state.state_code][
                        location.location_code
                      ][plant.plant_code][line.line_code].shifts[
                        shift.shiftName
                      ] = null;
                    });
                  }
                });
              });
            });
          });
        });
      });
    return this.companySetupConfigs;
  }

  getCompanySetupLines() {
    this.getCompanySetupConfigs().then((data: any) => {
      data.forEach((element) => {});
    });
    return this.companySetupConfigs;
  }

  async getDashboardSetupConfigs() {
    await this.httpClient
      .get('configs/apix/dashboard-setup.json')
      .subscribe((configs: any) => {
        this.dashboardSetupConfigs = configs;
      });
    return this.dashboardSetupConfigs;
  }

  getAPIConfigs(): Observable<any> {
    this.httpClient
      .get('configs/apix/apis.config.json')
      .subscribe((configs: any) => {
        const apiConfigs = {
          auth: configs.server.apis.auth,
          me: configs.server.apis.me,
          admin: configs.server.apis.admin,
          pda: configs.server.apis.pda,
        };
        this.apiConfigsObserver.next(apiConfigs);
        this.apiConfigs = apiConfigs;
      });
    return new Observable((observer) => {
      this.apiConfigsObserver = observer;
    });
  }

  getConnection(): Observable<boolean> {
    return new Observable((observer) => {
      this.connectionState = observer;
    });
  }

  getConnectionsCount(): Observable<number> {
    return new Observable((observer) => {
      this.connectionsCountObserver = observer;
    });
  }
}
