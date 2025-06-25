import { PageContentValues } from '../../../api/content/types/page';

export type PageMenuItem = NonNullable<PageContentValues['elements']['pageMenuItem']>['values'][number];
