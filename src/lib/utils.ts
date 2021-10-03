import { 
    AsyncCheckerMethods, 
    CheckerMethods, 
    FormStateErrorsAndWarningsType, 
    FormStateTouchedType, 
    FormStateType 
} from "./types";

export function getMessages<FormValues>(
    params: Partial<FormValues>,
    form: FormStateType<FormValues>,
    checkers?: CheckerMethods<FormValues>
): FormStateErrorsAndWarningsType<FormValues> {
    const messages = {} as FormStateErrorsAndWarningsType<FormValues>;
    if (!checkers) return messages;
    return Object.keys(params).reduce((accumulator, field) => {
        const formFieldName = field as keyof FormValues;
        const formValue = params[formFieldName];
        const checkerMethod = checkers[formFieldName];
        if (checkerMethod) return { ...accumulator, [formFieldName]: checkerMethod(formValue!, form) };
        return accumulator
    }, messages);
};

export async function asyncGetMessages<FormValues>(
    params: Partial<FormValues>,
    form: FormStateType<FormValues>,
    asyncCheckers?: AsyncCheckerMethods<FormValues>
): Promise<FormStateErrorsAndWarningsType<FormValues>> {

    const messages = {} as FormStateErrorsAndWarningsType<FormValues>;
    if (!asyncCheckers) return messages;
    const messageObjectPromises: Array<Promise<FormStateErrorsAndWarningsType<FormValues>>> = [];
    Object.keys(params).forEach(
        (field) => {
            const formFieldName = field as keyof FormValues;
            const formValue = params[formFieldName];
            const checkerMethod = asyncCheckers[formFieldName];
            if (checkerMethod) {
                messageObjectPromises.push(new Promise<FormStateErrorsAndWarningsType<FormValues>>((res) => {
                    const resolveMessage = async () => {
                        const resolvedMessage = await checkerMethod(formValue!, form);
                        const messageObject = { [formFieldName]: resolvedMessage } as FormStateErrorsAndWarningsType<FormValues>;
                        res(messageObject)
                    }
                    resolveMessage();
                }))
            }
        })

    return await Promise.all(messageObjectPromises).then(result => {
        return result.reduce((accumulator, field) => {
            if (!field) return accumulator
            return {
                ...accumulator,
                ...field,
            }
        }, messages)
    });
};

export function getTouched<FormValues> (params:Partial<FormValues>):FormStateTouchedType<FormValues> {
    const touched = {} as FormStateTouchedType<FormValues>;
    return Object.keys(params).reduce((accumulator, field) => {
            const formFieldName = field as keyof FormValues;
            return {
                ...accumulator,
                [formFieldName]: true
            };
        }, touched)
}