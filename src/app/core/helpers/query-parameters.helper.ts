import { HttpParams } from '@angular/common/http';
import {BaseFiltersDto} from "../interfaces/base-filters.dto";
import {PagedListConfiguration} from "../interfaces/paged-list/paged-list-configuration.dto";

export function prepareQueryParameters(
  filters: BaseFiltersDto,
  pagingSettings: PagedListConfiguration
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
