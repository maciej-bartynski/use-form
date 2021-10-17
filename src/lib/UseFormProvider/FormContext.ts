import { createContext, useContext } from 'react';
import { initialFormProviderContextValue } from './config';
import { Fields, FormProviderContextValue } from './types';

const FormProviderContext = createContext(initialFormProviderContextValue);
const useFormContext = function <Form extends {}>(): FormProviderContextValue<Form> {
    return useContext(FormProviderContext) as FormProviderContextValue<Form>;
};
const useField = function <Form extends Record<string, unknown>, FormKey extends keyof Form>(fieldName: FormKey):Fields<Form>[FormKey] {
    return useFormContext<Form>().fields[fieldName];
};

export { useFormContext, useField, FormProviderContext };
