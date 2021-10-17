import { FormValuesAbstract } from 'lib/types';
import {
    AsyncCheckers,
    Checkers,
    FormMessages,
    FormTouched,
    FormState,
    FormChecking,
} from './types';

export function getMessages<FormValues extends FormValuesAbstract>(
    params: Partial<FormValues>,
    form: FormState<FormValues>,
    checkers?: Checkers<FormValues>,
): FormMessages<FormValues> {
    const messages = {} as FormMessages<FormValues>;
    if (!checkers) return messages;
    return Object.keys(params).reduce((accumulator, field) => {
        const formFieldName = field as keyof FormValues;
        const formValue = params[formFieldName];
        const checkerMethod = checkers[formFieldName];
        if (checkerMethod)
            return {
                ...accumulator,
                [formFieldName]: checkerMethod(
                    // eslint-disable-next-line
                    formValue!,
                    form,
                ),
            };
        return accumulator;
    }, messages);
}

export async function asyncGetMessages<FormValues extends FormValuesAbstract>(
    params: Partial<FormValues>,
    form: FormState<FormValues>,
    asyncCheckers?: AsyncCheckers<FormValues>,
): Promise<FormMessages<FormValues>> {
    const messages = {} as FormMessages<FormValues>;
    if (!asyncCheckers) return messages;
    const messageObjectPromises: Array<Promise<FormMessages<FormValues>>> = [];
    Object.keys(params).forEach((field) => {
        const formFieldName = field as keyof FormValues;
        const formValue = params[formFieldName];
        const checkerMethod = asyncCheckers[formFieldName];
        if (checkerMethod) {
            messageObjectPromises.push(
                new Promise<FormMessages<FormValues>>((res) => {
                    const resolveMessage = async () => {
                        const resolvedMessage = await checkerMethod(
                            // eslint-disable-next-line
                            formValue!,
                            form,
                        );
                        const messageObject = {
                            [formFieldName]: resolvedMessage,
                        } as FormMessages<FormValues>;
                        res(messageObject);
                    };
                    resolveMessage();
                }),
            );
        }
    });

    return await Promise.all(messageObjectPromises).then((result) => {
        return result.reduce((accumulator, field) => {
            if (!field) return accumulator;
            return {
                ...accumulator,
                ...field,
            };
        }, messages);
    });
}

export function getFalsifiedChecking<FormValues extends FormValuesAbstract>(checkings: FormChecking<FormValues>):FormChecking<FormValues> {
    return Object.keys(checkings).reduce((result, key)=>({
        ...result, 
        [key]: false,
    }), checkings)
}

export function getChecking<FormValues extends FormValuesAbstract>(
    params: Partial<FormValues>,
    warningators?: Checkers<FormValues>,
    validators?: Checkers<FormValues>,
    asyncWarningators?: AsyncCheckers<FormValues>,
    asyncValidators?: AsyncCheckers<FormValues>
): FormChecking<FormValues> {
    const fieldsWitchChecker = Object
        .keys(params)
        .reduce((result, key: keyof FormValues) => {
            const hasChecker =
                !!(warningators && warningators[key])
                || !!(validators && validators[key])
                || !!(asyncValidators && asyncValidators[key])
                || !!(asyncWarningators && asyncWarningators[key]);

            return {
                ...result,
                [key]: hasChecker
            }
        }, {} as FormChecking<FormValues>);
    return fieldsWitchChecker
}

export function getTouched<FormValues extends FormValuesAbstract>(params: Partial<FormValues>): FormTouched<FormValues> {
    const touched = {} as FormTouched<FormValues>;
    return Object.keys(params).reduce((accumulator, field) => {
        const formFieldName = field as keyof FormValues;
        return {
            ...accumulator,
            [formFieldName]: true,
        };
    }, touched);
}
