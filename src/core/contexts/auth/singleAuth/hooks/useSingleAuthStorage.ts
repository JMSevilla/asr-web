import { MemberRecord } from "../../../../../api/mdp/types";
import { useSessionStorage } from "../../../../hooks/useSessionStorage";

export type SingleAuthData = {
  nextUrl: string;
  b2cPolicyId: string;
  primaryBgroup: string;
  primaryRefno: string;
  linkedBgroup: string;
  linkedRefno: string;
  authGuid: string;
  memberRecord?: MemberRecord;
  isNewAccount?: boolean;
  hasMultipleRecords?: boolean;
  registrationCode?: string;
  isAdmin?: boolean;
};

export function useSingleAuthStorage() {
  return useSessionStorage<SingleAuthData>('singleAuthData', {
    nextUrl: '',
    b2cPolicyId: '',
    primaryBgroup: '',
    primaryRefno: '',
    linkedBgroup: '',
    linkedRefno: '',
    authGuid: '',
  });
}
