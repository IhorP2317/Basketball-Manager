import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StatisticFiltersDto } from '../interfaces/statistic/statistic-filters.dto';
import { Statistic } from '../interfaces/statistic/statistic.model';
import {
  convertHttpParamsToObject,
  prepareQueryParameters,
} from '../helpers/query-parameters.helper';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { StatisticDto } from '../interfaces/statistic/statistic.dto';

@Injectable({
  providedIn: 'root',
})
export class StatisticEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  getAllStatisticsByMatch(
    matchId: string,
    statisticFilters: StatisticFiltersDto,
    pagingSettings: PagedListConfiguration,
  ) {
    let paramsFilters = prepareQueryParameters(statisticFilters);
    let paramsPagingSettings = prepareQueryParameters(pagingSettings);
    let combinedParams = new HttpParams();
    combinedParams = combinedParams.appendAll(
      convertHttpParamsToObject(paramsFilters),
    );
    combinedParams = combinedParams.appendAll(
      convertHttpParamsToObject(paramsPagingSettings),
    );

    return this.http.get<PagedList<Statistic>>(
      `${this.baseUrl}/matches/${matchId}/statistics`,
      {
        params: combinedParams,
      },
    );
  }

  createStatistic(statistic: StatisticDto) {
    return this.http.post<Statistic>(`${this.baseUrl}/statistics/`, statistic);
  }

  updateStatistic(statistic: StatisticDto) {
    return this.http.put<void>(`${this.baseUrl}/statistics/`, statistic);
  }

  deleteStatistic(
    matchId: string,
    playerExperienceId: string,
    timeUnit: number,
  ) {
    return this.http.delete<void>(
      `${this.baseUrl}/statistics/matches/${matchId}/players/experiences/${playerExperienceId}/${timeUnit}`,
    );
  }
}
