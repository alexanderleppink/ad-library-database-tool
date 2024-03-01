interface QueryResultData {
  id: string;
  ad_creative_link_captions: string;
  ad_delivery_start_time: string;
  ad_snapshot_url: string;
  eu_total_reach: number;
}

export const pageSize = 5000;
export type ResultField = keyof QueryResultData;

export interface QueryResult<T extends ResultField> {
  data: Pick<QueryResultData, T>[];
  paging: {
    next: string;
  };
}
