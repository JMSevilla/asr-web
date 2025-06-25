export interface HistoryKeys {
  _id: string;
  titleKey: string;
}

export const HISTORY_KEYS: HistoryKeys[] = [
  {
    _id: 'REFERRAL_INITIATED',
    titleKey: 'Track_LVFAS_referral_initiated',
  },
  {
    _id: 'WELCOME_PACK',
    titleKey: 'Track_LVFAS_welcome_pack',
  },
  {
    _id: 'WELCOME_PACK_ISSUED',
    titleKey: 'Track_LVFAS_welcome_pack_issued',
  },
  {
    _id: 'FIRST_APPOINTMENT',
    titleKey: 'Track_LVFAS_first_appointment',
  },
  {
    _id: 'FACT_FIND',
    titleKey: 'Track_LVFAS_fact_find',
  },
  {
    _id: 'FACT_FIND_STARTED',
    titleKey: 'Track_LVFAS_fact_find_started',
  },
  {
    _id: 'FACT_FIND_COMPLETED',
    titleKey: 'Track_LVFAS_fact_find_completed',
  },
  {
    _id: 'RECOMMENDATION',
    titleKey: 'Track_LVFAS_recommendation',
  },
];
