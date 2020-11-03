import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UserSearchPipe', pure: false })
export class UserSearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(user => {
        if (user.name) {
          return user.name.search(searchText) !== -1;
        } else if (user.fullName) {
          return user.fullName.search(searchText) !== -1;
        } else if (user.profile && user.profile.name) {
          return user.profile.name.search(searchText) !== -1;
        } else {
          return user.username.search(searchText) !== -1;
        }
      });
    }
  }
}
