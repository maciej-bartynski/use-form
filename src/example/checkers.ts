import { CheckerMethods } from "lib/types";
import { ExampleFormValues } from "./config";

export const validators: CheckerMethods<ExampleFormValues> = {
    mail: (txt: string) => {
        return txt.length < 1 ? "Mail is required" : undefined;
    },
    name: (txt: string) => {
        return txt.length < 1 ? "Name is required" : undefined;
    },
    surname: (txt: string) => {
        return txt.length < 1 ? "Surname is required" : undefined;
    }
}

export const warningators: CheckerMethods<ExampleFormValues> = {
    react: (checked: boolean) => {
        return !checked ? "You should learn, then..." : undefined;
    }
}