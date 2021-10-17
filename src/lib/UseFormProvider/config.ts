import { FormProviderContextValue } from './types';
import { getInitialContextValue } from 'lib/useForm/config';

const INITIAL_VALUES: InitialValues = {
    ['']: undefined,
};

export type InitialValues = {};

export const initialFormProviderContextValue: FormProviderContextValue<InitialValues> = {
    fields: {
        ['']: {
            setField: (): void => {},
            touchField: (): void => {},
            validateField: (): void => {},
            asyncValidateField: async (): Promise<void> => {},
            value: undefined,
            touched: false,
            error: '',
            asyncError: '',
            warning: '',
            asyncWarning: '',
        },
    },
    form: getInitialContextValue(INITIAL_VALUES),
};
