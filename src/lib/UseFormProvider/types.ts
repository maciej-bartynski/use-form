import { FormContextType } from 'lib/useForm/types';

export type InitialForm<Form extends {}> = {
    [Property in keyof Form]: Form[Property];
};

export type Field<FieldValue> = {
    setField: (arg: FieldValue) => void;
    touchField: () => void;
    validateField: () => void;
    value: FieldValue;
    error: string | undefined;
    asyncError: string | undefined;
    warning: string | undefined;
    asyncWarning: string | undefined;
    touched: boolean;
    asyncValidateField: () => Promise<void>;
};

export type Fields<Form extends {}> = {
    [Property in keyof Form]: Field<Form[Property]>;
};

export type FormProviderContextValue<Form extends {}> = {
    fields: Fields<Form>;
    form: FormContextType<Form>;
};
