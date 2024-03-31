import { Component } from '@angular/core';
import {PLAYER_POSITIONS} from "../../shared/constants/selectOption.constant";
import {PagedList} from "../../core/interfaces/paged-list/paged-list.model";
import {Player} from "../../core/interfaces/player/player.model";
import {PagedListConfiguration} from "../../core/interfaces/paged-list/paged-list-configuration.dto";
;

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent {
positions= PLAYER_POSITIONS;
countries = [{value:'All countries'},{value:'Ukraine'}, {value:'United States'}]
  teamNames = [{value:'All teams'},{value:'Ukraine'}, {value:'United States'}]
  pagedPlayerList: PagedList<Player> = {
    items: [
      {
        id: 'player1',
        lastName: 'Doe',
        firstName: 'John',
        dateOfBirth: new Date('1990-01-01'),
        country: 'USA',
        height: 190,
        weight: 90,
        position: 'Forward',
        jerseyNumber: 9,
        teamName: 'Lakers Lakers Lakers Lakers Lakers Lakers Lakers Lakers',
        teamId: 'team1',
        photoPath: 'assets/images/empty-staff.jpg',
        createdTimestamp: new Date(),
        createdBy: 'admin',
      },
      {
        id: 'player2',
        lastName: 'Smith',
        firstName: 'Jane',
        dateOfBirth: new Date('1988-02-02'),
        country: 'Canada',
        height: 180,
        weight: 70,
        position: 'Guard',
        jerseyNumber: 11,
        teamName: 'LionsT',
        teamId: 'team2',
        photoPath: 'assets/images/empty-staff.jpg',
        createdTimestamp: new Date(),
        createdBy: 'admin',
      }
    ],
    page: 1,
    pageSize: 10,
    totalCount: 1,
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
