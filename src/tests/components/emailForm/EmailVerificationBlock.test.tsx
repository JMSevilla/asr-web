import { ComponentProps } from 'react';
import { EmailVerificationBlock } from '../../../components';
import { useApiCallback } from '../../../core/hooks/useApi';
import { render, screen, userEvent, waitFor } from '../../common';
import React from 'react';
import { act } from 'react-dom/test-utils';

const DEFAULT_PROPS: ComponentProps<typeof EmailVerificationBlock> = {
    id: 'id',
    pageKey: 'pageKey',
    parameters: [],
    isJourney: true,
    isStandAlone: false,
    panelList: [],
};

jest.mock('../../../config', () => ({
    getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
    config: { value: jest.fn() },
}));


jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
    useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
    usePersistentAppState: jest
        .fn()
        .mockReturnValue({ bereavement: { form: { values: {}, resetPersonType: jest.fn() } } }),
}));

jest.mock('../../../core/hooks/useGenericStepData', () => ({
    useGenericStepData: jest.fn().mockReturnValue({ save: { execute: jest.fn() } }),
}));

jest.mock('../../../core/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        loading: false,
        asPath: '',
        parsedQuery: {
            type: 'quote',
        },
    }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
    useApi: jest.fn().mockReturnValue({ result: { data: null }, loading: false }),
    useApiCallback: jest.fn().mockReturnValue({
        result: { data: { quotes: null } },
        loading: false,
        execute: () => Promise.resolve({ result: { data: null } }),
    }),
}));

jest.mock('../../../cms/inject-tokens', () => ({
    useTokenEnrichedValue: (object: Object) => object,
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
    useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/contexts/contentData/ContentDataContext', () => ({
    useContentDataContext: jest.fn().mockReturnValue({ membership: {} }),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
    useRetirementContext: jest.fn().mockReturnValue({
        retirementCalculation: undefined,
        retirementCalculationLoading: false,
        transferOptions: undefined,
        transferOptionsLoading: false,
        quotesOptions: undefined,
        quotesOptionsError: undefined,
        quotesOptionsLoading: false,
    }),
}));

describe('EmailVerificationBlock', () => {
    it('should display email verification block with email form', () => {
        render(<EmailVerificationBlock {...DEFAULT_PROPS} />);
        expect(screen.queryByTestId('email_form')).toBeTruthy();
    });

    it('should display email verification block with email verification form', async () => {
        const setEnabled = jest.fn()
        const initialStateConfirmPage = () => [true, setEnabled]

        React.useState = jest.fn()
            .mockImplementationOnce(() => ['', () => null])
            .mockImplementationOnce(initialStateConfirmPage)
            .mockImplementation((x) => [x, () => null]);
        const spyScrollTo = jest.fn();
        Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo });

        render(<EmailVerificationBlock {...DEFAULT_PROPS} />);
        expect(screen.queryByTestId('email_verification_form')).toBeTruthy();

    });
    it('should resend token on click if token expired', async () => {
        const setEnabled = jest.fn()
        const initialStateConfirmPage = () => [true, setEnabled]
        const initialStateEnabled = () => [true, setEnabled]
        const initialStateToken = () => ['', () => null]
        const initialStateEmail = () => ['', () => null]
        const initialStateTotalTimeLeft = () => [0, () => null]
        const initialStateExpiredToken = () => [true, () => null]
        const initialStateIsCodeResent = () => [false, () => null]

        React.useState = jest.fn()
            .mockImplementationOnce(() => ['', () => null])
            .mockImplementationOnce(initialStateConfirmPage)
            .mockImplementationOnce(initialStateEnabled)
            .mockImplementationOnce(initialStateToken)
            .mockImplementationOnce(initialStateEmail)
            .mockImplementationOnce(initialStateTotalTimeLeft)
            .mockImplementationOnce(initialStateExpiredToken)
            .mockImplementationOnce(initialStateIsCodeResent)
            .mockImplementation((x) => [x, () => null]);
        const spyScrollTo = jest.fn();
        Object.defineProperty(global.window, 'scrollTo', { value: spyScrollTo });

        render(<EmailVerificationBlock {...DEFAULT_PROPS} />);
        expect(screen.queryByTestId('email_verification_form')).toBeTruthy();
        const resendButton = screen.queryByTestId('expired-token-button')
        expect(resendButton).toBeTruthy();

        await act(async () => {
            if (resendButton) {
                await userEvent.click(resendButton);
            }
        });
        expect(setEnabled).toHaveBeenCalled();
    });
});

