import * as dotenv from 'dotenv';
dotenv.config();

export const user = {
    USER: process.env.USER,
    PASSWORD: process.env.SENHA
}
