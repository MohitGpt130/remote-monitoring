export class Role {
  name: string;
  code: string;
  title: string;
  privileges: {
    menus: [RoleMenu],
  };
}

export class RoleMenu {
  name: string;
  title: string;
  route: [Route];
  icon: string;
}

export class Route {
  name: string;
  title: string;
  component: [Component];
  link: string;
}

export class Component {
  name: string;
  title: string;
  activities: [Activity];
}

export class Activity {
  name: string;
  title: string;
}

export class Privilege {
  menu: string;
  title: string;
}
