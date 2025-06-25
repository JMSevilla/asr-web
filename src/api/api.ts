import { AuthenticationApi } from './authentication/api';
import { ContentApi } from './content/api';
import { MdpApi } from './mdp/api';

export class Api {
  constructor(
    readonly authentication: AuthenticationApi,
    readonly mdp: MdpApi,
    readonly content: ContentApi
  ) {}
}
