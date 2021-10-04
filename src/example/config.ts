export interface ExampleFormValues {
    name: string;
    surname: string;
    mail: string;
    react: boolean;
}

export const initialValues: ExampleFormValues = {
    name: 'Maciej',
    surname: 'Bartyński',
    mail: 'maciekbartynski@gmail.com',
    react: true,
};
