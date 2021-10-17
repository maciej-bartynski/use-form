import useForm from 'lib/useForm';
import React, { PropsWithChildren, ReactNode } from 'react';
import { FormProviderContextValue } from './types';
import { FormProviderContext } from './FormContext';
import { createFieldHelpers } from './helpers';

interface FormProviderProps<Form extends {}> {
    initialValues: Form;
    children: ReactNode | ((param: FormProviderContextValue<Form>) => ReactNode);
}

const FormProvider = function <Form extends {}>({
    initialValues,
    children,
}: PropsWithChildren<FormProviderProps<Form>>) {
    const form = useForm<Form>({
        initialValues,
        initialDirty: false,
        onSubmitFail: () => {},
        onSubmit: async () => {},
        asyncValidators: {},
        asyncWarningators: {},
        validators: {},
        warningators: {},
    });

    const fields = createFieldHelpers<Form>(initialValues, form);

    const context = {
        fields,
        form,
    };

    return (
        <FormProviderContext.Provider value={context}>
            {typeof children === 'function' ? children(context) : children}
        </FormProviderContext.Provider>
    );
};

export default FormProvider;
