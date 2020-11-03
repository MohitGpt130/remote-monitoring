import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SfwComponentsService {

  constructor() { }

  convertSFWTableData(data, key): any {
    const tableData = {};
    data.forEach(element => {
      tableData[element[key]] = element;
    });
  }

  machines2Parameters(data, key): any {
    const tableData = {};
    if(data && data.length>0) {
      data.forEach(element => {
        Object.keys(element).forEach(parameter => {
          if(!tableData[parameter]) {
            tableData[parameter] = {};
          }
          tableData[parameter][element[key]] = element[parameter];
        });
      });
    }
    return tableData;
  }

}
