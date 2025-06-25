import {
  constructContactPreferencesMessageKey,
  useContactPreferencesDisabledFields,
} from '../../../components/blocks/memberDetails/hooks';
import { useApi } from '../../../core/hooks/useApi';
import { renderHook } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));
jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
}));

describe('hooks', () => {
  describe('useContactPreferencesDisabledFields', () => {
    it('should call useApi and return disabled fields', async () => {
      jest.mocked(useApi).mockReturnValue({
        result: {
          data: {
            email: 'email',
            number: '',
            streetAddress1: 'streetAddress1',
          },
        },
      } as any);
      const result = renderHook(() => useContactPreferencesDisabledFields());

      expect(result.result.current.fields).toEqual([false, true, false]);
    });
  });

  describe('constructContactPreferencesMessageKey', () => {
    it('should return empty message', () => {
      const result = constructContactPreferencesMessageKey(false, false, false);

      expect(result).toEqual('');
    });

    it('should return message for disabled email, phone and post', () => {
      const result = constructContactPreferencesMessageKey(true, true, true);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_email_phone_post');
    });

    it('should return message for disabled email and phone', () => {
      const result = constructContactPreferencesMessageKey(true, true, false);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_email_phone');
    });

    it('should return message for disabled email and post', () => {
      const result = constructContactPreferencesMessageKey(true, false, true);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_email_post');
    });

    it('should return message for disabled phone and post', () => {
      const result = constructContactPreferencesMessageKey(false, true, true);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_phone_post');
    });

    it('should return message for disabled email', () => {
      const result = constructContactPreferencesMessageKey(true, false, false);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_email');
    });

    it('should return message for disabled phone', () => {
      const result = constructContactPreferencesMessageKey(false, true, false);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_phone');
    });

    it('should return message for disabled post', () => {
      const result = constructContactPreferencesMessageKey(false, false, true);

      expect(result).toEqual('my_details_comm_pref_disabled_info_message_post');
    });
  });
});
