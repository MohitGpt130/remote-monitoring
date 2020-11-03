import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewChild, Renderer2, AfterViewInit,  } from '@angular/core';
import { MatVideoComponent } from 'mat-video/lib/video.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stop-video',
  templateUrl: './stop-video.component.html',
  styleUrls: ['./stop-video.component.scss']
})

export class StopVideoComponent implements OnInit, AfterViewInit {
  @ViewChild('video',{static:false}) matVideo: MatVideoComponent;
  video: HTMLVideoElement;

  stopID;
  machineName;
  videoLink
  isVideoAvailable;
  link
  formFaultCauses = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2,
    private httpClient: HttpClient
  ) {
    this.stopID = this.data.dataKey.id
    this.machineName = this.data.dataKey.machine
    this.link = this.data.dataKey.data.selectedRowFormattedValues[5];

    this.httpClient.get(this.link).subscribe(
      data => {
        var resData:any = data;
        if(resData.code!==undefined && resData.code==='200'){
          this.isVideoAvailable = true;
          this.videoLink = resData.link;
        } else if(resData.code!==undefined && resData.code==='404') {
        } else {
        }
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.video = this.matVideo.getVideoTag();

    // // Use Angular renderer or addEventListener to listen for standard HTML5 video events

  }

}
