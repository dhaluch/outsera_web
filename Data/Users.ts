import * as dotenv from 'dotenv';
// Force dotenv to override existing environment variables so CI-provided values take precedence
dotenv.config({ override: true });

//Credenciais de login, buscando o usuario e senha das variáveis de ambiente.
export const user = {
    // Prefer explicit SAUCE_* variables (to avoid collision with runner USER),
    // fall back to legacy USER/SENHA for local .env compatibility.
    USER: process.env.SAUCE_USER ?? process.env.USER,
    PASSWORD: process.env.SAUCE_SENHA ?? process.env.SENHA
}
