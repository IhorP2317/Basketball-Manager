import { Component } from '@angular/core';
import {USER_ROLES} from "../../shared/constants/selectOption.constant";
import {PagedList} from "../../core/interfaces/paged-list/paged-list.model";
import {Player} from "../../core/interfaces/player/player.model";
import {User} from "../../core/interfaces/user/user.model";
import {PagedListConfiguration} from "../../core/interfaces/paged-list/paged-list-configuration.dto";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  roles = USER_ROLES;

  pagedUserList: PagedList<User> = {
    items: [
      {
        id: 'user1',
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com',
        photoPath: 'assets/images/empty-staff.jpg',
        balance: 100,
        role: 'User',
        createdTimestamp: new Date(),
        createdBy: 'admin',
      },
      {
        id: 'user2',
        lastName: 'Smith',
        firstName: 'Jane',
        email: 'jane.smith@example.com',
        photoPath: 'assets/images/empty-staff.jpg',
        balance: 150,
        role: 'Admin',
        createdTimestamp: new Date(),
        createdBy: 'admin',
      },

    ],
    page: 1,
    pageSize: 10,
    totalCount: 2,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  pagingSettings: PagedListConfiguration = {
    page: 1,
    pageSize: 5
  }
  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.pagingSettings = pagingConfiguration;
  }
}


