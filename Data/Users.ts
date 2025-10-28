import * as dotenv from 'dotenv';
// Force dotenv to override existing environment variables so CI-provided .env values take precedence
dotenv.config({ override: true });

export const user = {
    USER: process.env.USER,
    PASSWORD: process.env.SENHA
}
