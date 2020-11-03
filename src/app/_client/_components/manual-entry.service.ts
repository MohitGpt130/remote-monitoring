import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManualEntryService {

  constructor(private httpClient: HttpClient) {
  }

  GetServerAPIPath(): Observable<object> {
    return this.httpClient.get('configs/apix/api_server.json');
  }
  //Type could be : machinestate, shutdownloss, downtimloss.

  GetSubstituteData(lineid, type, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/type?type=' + type + '&line_id=' + lineid)
  }

  GetLosscategory(lineid, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/type?type=losscategory&line_id=' + lineid)
  }

  GetLossData(lineid, type, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/loss?type=' + type + '&line_id=' + lineid)
  }

  GetUPDTDefintitionData(lineid, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/updt?line_id=' + lineid)
  }

  PostSubstituteData(data, URL): Observable<object> {
    return this.httpClient.post(URL + '/api/type', data);
  }
  GetEquipmentdata(lineid, URL, type): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/equipment/' + lineid + '?type=' + type);
  }

  GetSkuDetails(lineid, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/sku?line_id=' + lineid)
  }

  GetOperatorDetails(lineid, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/getoperator?origin=all');
  }
  GetDatapattern(): Observable<object> {
    return this.httpClient.get('configs/apix/data_pattern.json');
  }

  //Get Manpower designation
  GetDesingationDetails(lineid, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/type?type=manpowerdesignation&line_id=' + lineid);
  }

  GetCurrentBatchSKU(lineid, URL): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/currentsku');
  }

  GetDatafromURL(URL): Observable<object> {
    return this.httpClient.get(URL);
  }
  //Get email template data from fake api
  GetEmailTemplateData(user, api, namespace, URL): Observable<object> {
    return this.httpClient.get(URL + 'services/' + user + '/' + api + '/' + namespace);
  }

  GetShifts(URL): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/shift');
  }

  GetShiftDetails(URL, lineid): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/shift?line_id=' + lineid);
  }

  GetStateCauseData(URL, shift, date, state): Observable<object> {
    return this.httpClient.get(URL + '/api/trend/state_wise_report?date=' + date + '&shift=' + shift + '&machine_state=' + state);
  }
  ConvertToLocalTimezone(inputdate) {
    return new Date(inputdate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  }

  GetRejectReworkDetails(URl, shiftdate, lineid, shiftname): Observable<object> {
    return this.httpClient.get(URl + '/api/rework?date=' + shiftdate + '&line_id=' + lineid + '&shift_name=' + shiftname);
  }

  PostRejectReworkData(URL, data): Observable<object> {
    return this.httpClient.post(URL + '/api/rework', data);
  }

  GetEventDataForChart(URL, date, shift, type, lineid): Observable<object> {
    return this.httpClient.get(URL + '/api/trend/shifthistory?date=' + date + '&shift=' + shift + '&type=' + type + '&line_id=' + lineid + '');
  }

  GetOperatorData(URL): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/getoperator?origin=all');
  }

  PostOperatorData(URL, data): Observable<object> {
    return this.httpClient.post(URL + '/api/manual/postoperator', data);
  }

  GetPreviousShift(URL): Observable<object> {
    return this.httpClient.get(URL + '/api/shift/preshiftcalculation');
  }

  GetShiftEndReport(URL, LineID, shiftdate, shiftname): Observable<object> {
    console.log(URL + '/api/report/shift?line_id=' + LineID + '&shift=' + shiftname + '&date=' + shiftdate);

    return this.httpClient.get(URL + '/api/report/shift?line_id=' + LineID + '&shift=' + shiftname + '&date=' + shiftdate);
  }
  GetFormatData(URL, LineID): Observable<object> {
    return this.httpClient.get(URL + '/api/manual/format?line_id=' + LineID);
  }

  PostFormatData(URL, data): Observable<object> {
    return this.httpClient.post('http://13.233.134.82:4200/api/manual/format?line_id=GetBindDataGetBindData', data);
  }

  GetFormatListfromProductID(URL, ProductID) {
    return this.httpClient.get(URL + '/api/manual/sku/' + ProductID);
  }

  GetBatchDetailsForReport(URL, LineID, BatchNo) {
    console.log(URL + '/api/report/batch?line_id=' + LineID + '&batch=' + BatchNo);
    return this.httpClient.get(URL + '/api/report/batch?line_id=' + LineID + '&batch=' + BatchNo);
  }

  //Populating Batch Names for Dropdown

  GetBatchNames(URL, LineID) {
    return this.httpClient.get(URL + '/api/manual/batchtrigger');
  }

  GetFgexData(URL): Observable<object> {
    console.log(URL+'/api/fgex?fgex=all');
    return this.httpClient.get(URL+'/api/fgex?fgex=all');
  }

  //Will GET changeover Type (TypeA, Type B, Type C etc.)
  GetChangeOverData(URL) {
    console.log(URL + '/api/changeovermaster')
    return this.httpClient.get(URL + '/api/changeovermaster');
  }

  PostChangeoverData(URL, data) {
    console.log(URL + '/api/changeover', data);
    return this.httpClient.post(URL + '/api/changeover', data);
  }

  GetChangeoverCurrent(URL) {
    console.log(URL + '/api/changeover/current');
    return this.httpClient.get(URL + '/api/changeover/current');
  }
  BindChangeOverData(URL, LineID) {
    console.log(URL + '/api/sku?line_id=' + LineID);
    return this.httpClient.get(URL + '/api/sku?line_id=' + LineID);
  }

}
