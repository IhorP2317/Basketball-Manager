import { HttpParams } from '@angular/common/http';
import { BaseFiltersDto } from '../interfaces/base-filters.dto';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { MatchStatisticFiltersDto } from '../interfaces/statistic/match-statistic-filters.dto';

export function prepareQueryFiltersAndPagingSettings(
  filters: BaseFiltersDto,
  pagingSettings: PagedListConfiguration,
): HttpParams {
  let params = new HttpParams();
  for (const key in filters) {
    const value = filters[key];
    if (value !== undefined && value !== null) {
      params = params.append(key, value.toString());
    }
  }

  params = params.append('page', pagingSettings.page.toString());
  params = params.append('pageSize', pagingSettings.pageSize.toString());

  return params;
}

export function prepareMatchStatisticQueryParameters(
  filters: MatchStatisticFiltersDto,
): HttpParams {
  return prepareQueryParameters(filters);
}

export function prepareQueryParameters<T extends Record<string, unknown>>(
  filters: T,
): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      params = params.append(key, value.toString());
    }
  }

  return params;
}

export function convertHttpParamsToObject(params: HttpParams): {
  [param: string]:
    | string
    | number
    | boolean
    | readonly (string | number | boolean)[];
} {
  const obj: {
    [param: string]:
      | string
      | number
      | boolean
      | readonly (string | number | boolean)[];
  } = {};

  for (const key of params.keys()) {
    const values = params.getAll(key);
    if (values && values.length > 1) {
      obj[key] = values;
    } else {
      obj[key] = values ? values[0] : '';
    }
  }

  return obj;
}
