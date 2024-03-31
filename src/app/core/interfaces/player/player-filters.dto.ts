import {BaseFiltersDto} from "../base-filters.dto";

export interface PlayerFiltersDto extends BaseFiltersDto{
  country: string | null;
  position: string | null;
  teamName : string | null;
}
