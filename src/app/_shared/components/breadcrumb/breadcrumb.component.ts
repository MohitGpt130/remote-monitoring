import { Component, OnInit, Input } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  ActivatedRouteSnapshot,
  UrlSegment,
  NavigationEnd,
} from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() name: string = '';
  public pageTitle: string;
  public breadcrumbs: {
    name: string;
    url: string;
  }[] = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public title: Title
  ) {
    this.breadcrumbs = [];
    this.parseRoute(this.router.routerState.snapshot.root);
    this.pageTitle = '';
    this.breadcrumbs.forEach((breadcrumb) => {
      this.pageTitle += ' > ' + breadcrumb.name;
    });
    this.title.setTitle(name + this.pageTitle);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = [];
        this.parseRoute(this.router.routerState.snapshot.root);
        this.pageTitle = '';
        this.breadcrumbs.forEach((breadcrumb) => {
          this.pageTitle += ' > ' + breadcrumb.name;
        });
        this.title.setTitle(name + this.pageTitle);
      }
    });
  }

  ngOnInit(): void {}

  private parseRoute(node: ActivatedRouteSnapshot): void {
    if (node.data['breadcrumb']) {
      if (node.url.length) {
        let urlSegments: UrlSegment[] = [];
        node.pathFromRoot.forEach((routerState) => {
          urlSegments = urlSegments.concat(routerState.url);
        });
        let url = urlSegments
          .map((urlSegment) => {
            return urlSegment.path;
          })
          .join('/');
        this.breadcrumbs.push({
          name: node.data['breadcrumb'],
          url: '/' + url,
        });
      }
    }
    if (node.firstChild) {
      this.parseRoute(node.firstChild);
    }
  }

  public closeSubMenus(): void {
    let menu = document.querySelector('.sidenav-menu-outer');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }
}
