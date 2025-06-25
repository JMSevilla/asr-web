import { SubscriptionPreferencesForm } from '../../components/blocks/memberDetails/subscriptionPreferences/SubscriptionPreferencesForm';
import { useApiCallback } from '../../core/hooks/useApi';
import { render, screen } from '../common';

jest.mock('../../config', () => ({
    getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
    config: { value: jest.fn() },
}));

jest.mock('../../core/hooks/useFormSubmissionBindingHooks', () => ({
    useFormSubmissionBindingHooks: jest.fn().mockReturnValue({ cb: jest.fn(), key: 'key' }),
}));

jest.mock('../../core/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        loading: false,
        asPath: '',
    }),
}));

jest.mock('../../core/hooks/useApi', () => ({
    useApi: jest.fn().mockReturnValue({ result: { data: null }, loading: false }),
    useApiCallback: jest.fn().mockReturnValue({
        result: { data: { quotes: null } },
        loading: false,
        execute: () => Promise.resolve({ result: { data: null } }),
    }),
}));

const DEFAULT_DATA = {
    prefix: 'preference',
    initialPreferences: { email: true, sms: false, post: false },
    disabledFields: [],
};

describe('SubscriptionPreferencesForm', () => {
    it('should render subscription preference form', () => {
        const executeCb = jest.fn();
        jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeCb, loading: false } as any);

        render(<SubscriptionPreferencesForm {...DEFAULT_DATA} />);

        expect(screen.getByTestId('preference_form')).toBeTruthy();
    });
    it('should render subscription preference form with info message', () => {
        const executeCb = jest.fn();
        jest.mocked(useApiCallback).mockReturnValueOnce({ execute: executeCb, loading: false } as any);

        render(<SubscriptionPreferencesForm {...DEFAULT_DATA} initialPreferences={{ email: false, sms: false, post: true }} />);

        expect(screen.getByTestId('preference_form')).toBeTruthy();
        expect(screen.getByText('[[subscription_preferences_form_info_message]]')).toBeTruthy();
    });
});
