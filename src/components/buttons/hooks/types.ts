import { JourneyTypeSelection } from '../../../api/content/types/page';

type CustomActionArguments = {
  linkKey?: string;
  pageKey?: string;
  journeyType?: JourneyTypeSelection;
  actionParam?: string;
  params?: string;
};

export type CustomActionHook = (args?: CustomActionArguments) => {
  execute(): void | Promise<unknown>;
  loading: boolean;
  disabled?: boolean;
  disableFurtherActions?: boolean;
  node?: React.ReactNode;
  params?: string;
};
