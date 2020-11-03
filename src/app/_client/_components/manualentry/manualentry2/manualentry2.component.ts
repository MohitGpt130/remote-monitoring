import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../data.service';
import { AuthService } from '../../../auth/auth.service';

export interface LineData {
  companyname: string;
  countryname: string;
  statename: string;
  locationname: string;
  plantname: string;
  plantcode: string;
  lineid: string;
  linecode: string;
  linename: string;
}

@Component({
  selector: 'app-manualentry2',
  templateUrl: './manualentry2.component.html',
  styleUrls: ['./manualentry2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Manualentry2Component implements OnInit {
  headerInfo;
  sub: Subscription;
  connectionStatus;
  skuName;
  dashboard;
  public LinesData: LineData[] = [];
  skuNameDefinations = [
    '',
    'Product A',
    '5 LITRE FORTUNE',
    '2 LITRE KING',
    '5 LITRE KING',
    '5 LITRE PET',
  ];
  gotConnectionData: boolean = false;
  LineName = '';
  LineId = '';
  product;
  currentUser;
  OperatorName;

  manualEntryForm: FormGroup;
  lineSelect: FormControl;

  createFormControls() {
    this.lineSelect = new FormControl('');
  }

  createForm() {
    this.manualEntryForm = new FormGroup({
      lineSelect: this.lineSelect,
    });
  }

  constructor(
    // private socketappDataService: SocketappDataService,
    private authService: AuthService,
    private appDataService: DataService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();

    this.currentUser = this.authService.currentUserSubject.value;

    this.httpClient
      .get('configs/apix/api_server.json')
      .subscribe((data: any) => {
        if (data.server !== undefined) {
          //this.appDataService.getInit(data);
          this.product = data.product;
        } else {
        }
      });
    // setInterval(() => {
    //   if (this.headerInfo !== undefined) {
    //     this.headerInfo.currentTime = new Date(new Date(this.headerInfo.currentTime).setSeconds(new Date(this.headerInfo.currentTime).getSeconds() + 1));
    //   }
    // }, 1000);

    // this.sub = this.appDataService.getHeaderInformationData().subscribe(data => {
    //   this.headerInfo = data;
    //   this.OperatorName = data.currentOperator;
    // });

    // this.sub = this.appDataService.getConnectionsStatus().subscribe(data => {
    //   this.connectionStatus = data;
    //   this.gotConnectionData = true;
    // });

    // this.sub = this.appDataService.getMachineParametersTableData().subscribe(data => {
    //   //this.tableDataAsObject = data;
    //   //this.skuName = this.appDataService.apiData.skuData['filler'].sku_name;
    //   //this.skuName = this.appDataService.apiData.skuData['cam_blister'].sku_name===undefined?'':this.appDataService.apiData.skuData['cam_blister'].sku_name.sku_name;
    //   this.skuName = this.appDataService.apiData.skuData['cam_blister'].operator_name===undefined?'':this.appDataService.apiData.skuData['cam_blister'].operator_name.display_name;

    // });
    this.GetLineData();
  }

  GetLineData() {
    this.LinesData = [];
    //this.Companies = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe((apipath) => {
      if (apipath['server'] !== undefined) {
        this.httpClient
          .get(apipath['server'] + '/api/manual/company')
          .subscribe((data: any[]) => {
            //this.companydata = data;
            for (let i = 0; i < data.length; i++) {
              const company = data[i];
              company.countries.forEach((country) => {
                country.states.forEach((state) => {
                  state.locations.forEach((location) => {
                    location.plants.forEach((plant) => {
                      plant.lines.forEach((line) => {
                        const ELEMENT_DATA = {
                          companyname: company.company_name,
                          countryname: country.country_name,
                          statename: state.state_name,
                          locationname: location.location_name,
                          plantcode: plant.plant_code,
                          plantname: plant.plant_name,
                          lineid: line._id,
                          linecode: line.line_code,
                          linename: line.line_name,
                        };
                        this.LinesData.push(ELEMENT_DATA);
                      });
                    });
                  });
                });
              });
            }
            try
            {
            this.lineSelect.setValue(this.LinesData[0]);
            this.getLineDetails(this.LinesData[0]);
            }
            catch{}
          });
      }
    });
  }

  displayFn(line) {
    return line.linename +
      '-' +
      line.plantname +
      '-' +
      line.locationname +
      '-' +
      line.statename +
      '-' +
      line.countryname
      ? line.linename +
          '-' +
          line.plantname +
          '-' +
          line.locationname +
          '-' +
          line.statename +
          '-' +
          line.countryname
      : undefined;
  }

  getLineDetails(line) {
    this.LineId = line.lineid;
    this.LineName =
      line.linename +
      '-->' +
      line.plantname +
      '-->' +
      line.locationname +
      '-->' +
      line.countryname +
      '-->' +
      line.companyname;
  }

  tabChanged(v) {
  }

  logout() {
    this.authService.logout();
  }
}

