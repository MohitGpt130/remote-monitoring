export class User {
  id: number;
  name: string;
  email: string;
  code: string;
  fullName: string;
  profile: UserProfile;
  contacts: UserContacts;
  privilegesAccess: object;
  // roles: string[];
  // social: UserSocial;
  settings: UserSettings;
  constructor(obj?) {
    if (obj !== undefined) {
      this.name = obj.name;
      this.email = obj.email;
      this.code = obj.code;
      this.fullName = obj.fullName;
      this.profile = new UserProfile(obj.profile);
      this.contacts = obj.contacts;
      // this.social = obj.social;
      this.settings = obj.settings;
    }
  }
}

export class UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  gallery: [];
  image: string;
  birthDate: Date;
  nationality: string;
  maritalStatus: string;
  // contacts: UserContacts;
  // social: UserSocial;
  constructor(obj?) {
    if (obj !== undefined) {
      this.firstName = obj.firstName;
      this.middleName = obj.middleName;
      this.lastName = obj.lastName;
      this.gender = obj.gender;
      this.image = obj.image;
      this.birthDate = obj.birthDate;
      this.nationality = obj.nationality;
      this.maritalStatus = obj.maritalStatus;
      // this.contacts = new UserContacts(obj.contacts);
      // this.social = new UserSocial(obj.social);
    }
  }
}

export class UserWork {
  company: string;
  position: string;
  salary: number;
}

export class UserContacts {
  email: string;
  phone: string;
  address: string;
  constructor(obj?) {
    if (obj !== undefined) {
      this.email = obj.email;
      this.phone = obj.phone;
      this.address = obj.address;
    }
  }
}

export class UserSocial {
  facebook: string;
  twitter: string;
  google: string;
  constructor(obj) {
    // this.facebook = obj.facebook;
    // this.twitter = obj.twitter;
    // this.google = obj.google;
  }
}

export class UserSettings {
  isActive: boolean;
  registrationDate: Date;
  joinedDate: Date;
  homeRoute: string;
  constructor(obj?) {
    if (obj !== undefined) {
      this.isActive = obj.isActive;
      this.registrationDate = obj.registrationDate;
      this.joinedDate = obj.joinedDate;
      this.homeRoute = obj.homeRoute;
    }
  }
}
