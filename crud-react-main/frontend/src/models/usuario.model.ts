import { z } from 'zod';

export interface IUsuario {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    status: 'ativo' | 'inativo';
}

export const usuarioSchema = z.object({
    id: z.string().optional(),
    nome: z.string()
        .min(1, 'O nome é obrigatório')
        .min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string()
        .min(1, 'O email é obrigatório')
        .email('Digite um email válido'),
    senha: z.string()
        .min(1, 'A senha é obrigatória')
        .min(6, 'A senha deve ter no mínimo 6 caracteres'),
    status: z.enum(['ativo', 'inativo'])
});