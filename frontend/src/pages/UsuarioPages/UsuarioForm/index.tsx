import { useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import type { IUsuario } from "../../../models/usuario.model";

interface UsuarioFormProps {
    key?: string;
    usuario: IUsuario | null;
    onSave: (usuario: IUsuario) => void;
    onCancel: () => void;
    errors?: Record<string, string>;
}

export const UsuarioForm = (
    { usuario = null, onSave, onCancel, errors = {} }: UsuarioFormProps) => {

    const [usuarioState, setUsuarioState] = useState<IUsuario>(usuario || { id: '', nome: '', email: '', senha: '', status: 'inativo' });
    console.log('Erros recebidos no form:', errors);
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-body bg-light">
                            <h5 className="card-title">Formulario de Usuario</h5>
                            <hr />
                            <div className="container">
                                <form onSubmit={(e) => e.preventDefault()} >
                                    <Input
                                        label="Nome"
                                        id="nome"
                                        type="text"
                                        placeholder="Digite seu nome ..."
                                        value={usuarioState.nome}
                                        onChange={(value) => setUsuarioState({ ...usuarioState, nome: value })}
                                        error={errors.nome}
                                    />
                                    <Input
                                        label="Email"
                                        id="email"
                                        type="email"
                                        placeholder="Digite seu email ..."
                                        value={usuarioState.email}
                                        onChange={(value) => setUsuarioState({ ...usuarioState, email: value })}
                                        error={errors.email}
                                    />
                                    <Input
                                        label="Senha"
                                        id="senha"
                                        type="password"
                                        placeholder="Digite sua senha ..."
                                        value={usuarioState.senha}
                                        onChange={(value) => setUsuarioState({ ...usuarioState, senha: value })}
                                        error={errors.senha}
                                    />
                                </form>
                            </div>

                        </div>
                        <div className="card-footer">
                            <div className="row m-2">
                                <div className="col-6">
                                    <Button
                                        value="Cancelar"
                                        variant="secondary"
                                        type="button"
                                        onClick={() => onCancel()}
                                    />
                                </div>
                                <div className="col-6">
                                    <Button
                                        value={usuarioState.id ? "Atualizar" : "Salvar"}
                                        variant={usuarioState.id ? "warning" : "primary"}
                                        type="submit"
                                        onClick={() => onSave(usuarioState)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}