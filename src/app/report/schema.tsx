export interface ReportRowVo {
  day: string;
  imp: string;
  click: string;
  sale: string;
  order_cnt: string;
  cancel_cnt: string;
  revenue: string;
}

export interface ReportSumVo {
  imp?: number;
  click?: number;
  sale?: number;
  order_cnt?: number;
  cancel_cnt?: number;
  revenue?: number;
}
