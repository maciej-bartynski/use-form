import { AsyncCheckerMethods } from "lib/types";
import { ExampleFormValues } from "./config";

const mockExistingMails = ['existing@mail.com', 'example@mail.com', 'a@b.com'];
const mockExistingNames = ['Maciej', 'Mat', 'Matthew'];

export const asyncValidators: AsyncCheckerMethods<ExampleFormValues> = {
    mail: async function(txt, form) {
        return await new Promise((res) => {
            setTimeout(() => {
                const mailAlreadyExists = mockExistingMails.find(item => item.toLowerCase() === txt.trim().toLowerCase());
                res(mailAlreadyExists ? `Mail ${txt.trim().toLowerCase()} already exists!` : undefined)
            }, 1000)
        })
    },
    name: async function(txt, form) {
        return await new Promise((res) => {
            setTimeout(() => {
                const nameAlreadyExists = mockExistingNames.find(item => item.trim().toLowerCase() === txt.trim().toLowerCase());
                const nameMailIncompatibile = form.values.mail.split('@')[0].indexOf(txt.trim().toLocaleLowerCase()) < 0;
                const msg = nameAlreadyExists 
                    ? 'This name is taken' 
                    : nameMailIncompatibile 
                        ? 'Name should be a part of mail'
                        : undefined; 
                res(msg)
            }, 1000)
        })
    },
}