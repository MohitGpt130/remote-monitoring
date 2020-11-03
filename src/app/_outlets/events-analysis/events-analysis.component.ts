import { ActivatedRoute, Router, ParamMap, NavigationStart, NavigationEnd, NavigationError, Event } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-analysis',
  templateUrl: './events-analysis.component.html',
  styleUrls: ['./events-analysis.component.scss']
})
export class EventsAnalysisComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      console.log(params.get('lineID'));
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        this.route.paramMap.subscribe((params: ParamMap) => {
          console.log(params.get('lineID'));
        });
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }

}
