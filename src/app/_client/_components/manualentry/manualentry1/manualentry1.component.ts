import { Country } from './../plant/plant.component';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../data.service';
import { AuthService } from '../../../auth/auth.service';

export interface PlantData {
  companyname: string,
  countryname: string,
  statename: string,
  locationname: string,
  plantid: string;
  plantname: string;
  plantcode: string;
}

@Component({
  selector: 'app-manualentry1',
  templateUrl: './manualentry1.component.html',
  styleUrls: ['./manualentry1.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Manualentry1Component implements OnInit {

  headerInfo;
  sub: Subscription;
  connectionStatus;
  skuName;
  dashboard;
  public PlantsData: PlantData[] = [];
  skuNameDefinations = ['', 'Product A', '5 LITRE FORTUNE', '2 LITRE KING', '5 LITRE KING', '5 LITRE PET'];
  gotConnectionData: boolean = false;
  PlantName = '';
  PlantId ='';
  product;
  currentUser;
  OperatorName;

  constructor(
    // private socketappDataService: SocketappDataService,
    private authService: AuthService,
    private appDataService: DataService,
    private router: Router,
    private  httpClient: HttpClient,
  ) {
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserSubject.value;


    this.httpClient.get('configs/apix/api_server.json').subscribe(
      (data: any) => {
        if (data.server !== undefined) {
          this.appDataService.getInit(data);
          this.product = data.product;
        } else {
        }
      }
    );
    setInterval(() => {
      if (this.headerInfo !== undefined) {
        this.headerInfo.currentTime = new Date(new Date(this.headerInfo.currentTime).setSeconds(new Date(this.headerInfo.currentTime).getSeconds() + 1));
      }

    }, 1000);

    this.GetPlantData();
  }


  GetPlantData() {
    this.PlantsData = [];
    //this.Companies = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
            (data: any[]) => {
              //this.companydata = data;
              for (let i = 0; i < data.length; i++) {
                const company = data[i]
                company.countries.forEach(country => {
                  country.states.forEach(state => {
                    state.locations.forEach(location => {
                      location.plants.forEach(plant => {
                        //const data = {};
                        const ELEMENT_DATA =
                        {
                          companyname: company.company_name,
                          countryname: country.country_name,
                          statename: state.state_name,
                          locationname: location.location_name,
                          plantid: plant._id,
                          plantcode: plant.plant_code,
                          plantname: plant.plant_name
                        }
                        this.PlantsData.push(ELEMENT_DATA);
                      });
                    });
                  });
                });
              }
            }
          )
        }
      }
    );
  }

  displayFn(plant) {
    //this.PlantName = plant.plantname + '-' + plant.locationname + '-' + plant.statename + '-' + plant.countryname;
    return plant.plantname + '-' + plant.locationname + '-' + plant.statename + '-' + plant.countryname ? plant.plantname + '-' + plant.locationname + '-' + plant.statename + '-' + plant.countryname : undefined;
  }

  getPlantDetails(plant)
  {
    this.PlantId = plant.plantid;
    this.PlantName = plant.plantname + '-->' + plant.locationname+'-->'+plant.countryname+'-->'+plant.companyname;
  }

  tabChanged(v)
  {
  }
  logout() {
    this.authService.logout();
  }
}
