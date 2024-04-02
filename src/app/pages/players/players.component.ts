import { Component } from '@angular/core';
import { PLAYER_POSITIONS } from '../../shared/constants/selectOption.constant';
import { Player } from '../../core/interfaces/player/player.model';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PlayersPageService } from './services/players.page.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Country } from '@angular-material-extensions/select-country';

@UntilDestroy()
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  providers: [PlayersPageService],
})
export class PlayersComponent {
  positions = PLAYER_POSITIONS;
  currentSortColumn: string = 'default';
  isDescendingSortingOrder = false;
  selectedTeam = 'All teams';
  searchedPlayer = '';
  selectedCountry: Country | null = null;
  selectedPosition: string = 'All positions';
  filters = this.playersPageService.filters$.pipe((filters) => filters);
  selectTeams = this.playersPageService.teams$.pipe((teams) => teams);
  playerPagedList = this.playersPageService.pagedListPlayers$.pipe(
    (players) => players,
  );

  constructor(
    private playersPageService: PlayersPageService,
    public dialog: MatDialog,
  ) {}

  onDeletePlayerClicked(player: Player): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete ${player.lastName + ' ' + player.firstName}?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        untilDestroyed(this),
      )
      .subscribe(() => this.playersPageService.deletePlayer(player.id));
  }

  onSelectedTeamChange() {
    if (this.selectedTeam === 'All teams') {
      this.playersPageService.setSelectedTeam(null);
    } else {
      this.playersPageService.setSelectedTeam(this.selectedTeam);
    }
  }

  onSelectedPositionChange() {
    if (this.selectedPosition === 'All positions') {
      this.playersPageService.setSelectedPosition(null);
    } else {
      this.playersPageService.setSelectedPosition(this.selectedPosition);
    }
  }

  onSelectedCountryChange() {
    if (!this.selectedCountry || !this.selectedCountry.name) {
      this.playersPageService.setSelectedCountry(null);
      return;
    }

    this.playersPageService.setSelectedCountry(this.selectedCountry.name);
  }

  onSearchPlayerChanged() {
    if (this.searchedPlayer !== null) {
      const trimmedString = this.searchedPlayer.replace(/\\s+/g, '');
      if (trimmedString.length < 1)
        this.playersPageService.setSearchedPlayer(null);
    }
    this.playersPageService.setSearchedPlayer(this.searchedPlayer);
  }

  onSortColumnClicked(sortColumn: string) {
    if (this.currentSortColumn === sortColumn) {
      this.isDescendingSortingOrder = !this.isDescendingSortingOrder;
    } else {
      this.isDescendingSortingOrder = false;
    }
    this.currentSortColumn = sortColumn;
    this.playersPageService.changeSortingSettings(
      sortColumn,
      this.isDescendingSortingOrder,
    );
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.playersPageService.changePagedListSettings(pagingConfiguration);
  }
}
