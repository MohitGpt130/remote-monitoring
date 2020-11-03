export class Privilege {
  name: string;
  title: string;
  route: [Route];
  icon: string;
}

export class Route {
  name: string;
  title: string;
  component: [PrivilegeComponent];
  link: string;
}

export class PrivilegeComponent {
  name: string;
  title: string;
  activities: [PrivilegeComponentActivity];
}

export class PrivilegeComponentActivity {
  name: string;
  title: string;
}
