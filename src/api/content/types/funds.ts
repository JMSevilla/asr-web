export interface ContentFunds {
  funds: ContentFund[];
}

export interface ContentFund {
  fundName: string;
  fundCode: string;
  fundGroup: string;
  factsheetUrl: string;
  orderNo?: number;
}
