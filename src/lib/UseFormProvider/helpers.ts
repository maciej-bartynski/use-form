import { FormContextType } from 'lib/useForm/types';
import { Fields, InitialForm } from './types';

export function createFieldHelpers<Form extends InitialForm<Form>>(
    initialValues: Form,
    form: FormContextType<Form>,
): Fields<Form> {
    const fields = Object.entries(initialValues).reduce((result, [key]) => {
        const fieldName = key as keyof Form;
        const fieldHelpers = {
            ...result,
            [key]: {
                setField: (param: unknown): void => form.setValues({ [fieldName]: param } as Partial<Form>),
                touchField: (param?: unknown): void => form.setTouched({ [fieldName]: param } as Partial<Form>),
                validateField: (param?: unknown): void => form.setMessages({ [fieldName]: param } as Partial<Form>),
                asyncValidateField: async (param?: unknown): Promise<void> =>
                    form.asyncSetMessages({ [fieldName]: param } as Partial<Form>),
                value: form.values[fieldName],
                touched: form.touched[fieldName],
                error: form.errors[fieldName],
                asyncError: form.asyncErrors[fieldName],
                warning: form.warnings[fieldName],
                asyncWarning: form.asyncWarnings[fieldName],
            },
        };
        return fieldHelpers;
    }, {} as Fields<Form>);
    return fields;
}
