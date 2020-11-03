//import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface LineData {
  companyname: string,
  countryname: string,
  statename: string,
  locationname: string,
  plantname: string,
  plantcode: string,
  lineid: string,
  linecode: string,
  linename: string
}
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  public LinesData: LineData[] = [];
  LineName = '';
  LineId = '';

  GetLineData() {
    this.LinesData = [];
    this.httpClient.get('configs/apix/api_server.json').subscribe(
      apipath => {
        if (apipath['server'] !== undefined) {
          this.httpClient.get(apipath['server'] + '/api/manual/company').subscribe(
            (data: any[]) => {
              for (let i = 0; i < data.length; i++) {
                const company = data[i]
                company.countries.forEach(country => {
                  country.states.forEach(state => {
                    state.locations.forEach(location => {
                      location.plants.forEach(plant => {
                        plant.lines.forEach(line => {
                          const ELEMENT_DATA =
                          {
                            companyname: company.company_name,
                            countryname: country.country_name,
                            statename: state.state_name,
                            locationname: location.location_name,
                            plantcode: plant.plant_code,
                            plantname: plant.plant_name,
                            lineid: line._id,
                            linecode: line.line_code,
                            linename: line.line_name
                          }
                          this.LinesData.push(ELEMENT_DATA);
                        });
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

  constructor(private httpClient: HttpClient
  ) {

  }

  displayFn(line) {
    return line.linename + '-' + line.plantname + '-' + line.locationname + '-' + line.statename + '-' + line.countryname ? line.linename + '-' + line.plantname + '-' + line.locationname + '-' + line.statename + '-' + line.countryname : undefined;
  }

  getLineDetails(line) {
    this.LineId = line.lineid;
    this.LineName = line.linename + '-->' + line.plantname + '-->' + line.locationname + '-->' + line.countryname + '-->' + line.companyname;
  }

  tabChanged(v) {
    console.log(v);
  }

  ngOnInit() {
    this.GetLineData();
  }

}
