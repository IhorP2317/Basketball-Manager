import {BaseFiltersDto} from "../base-filters.dto";

export interface MatchFiltersDto extends BaseFiltersDto {
  year?: number | null;
  month?: number | null;
  teamName?: string | null;
  status?: string | null;
}
