import { useEffect, useState } from "react";
import type { IUsuario } from "../../models/usuario.model";
import { usuarioSchema } from "../../models/usuario.model";
import { usuariosService } from "../../services/usuario.service";
import { UsuarioForm } from "./UsuarioForm";
import { UsuarioTable } from "./UsuarioTable";

export const UsuarioPages = () => {
  // ==================== ESTADOS ====================
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [listaUsuarios, setListaUsuarios] = useState<IUsuario[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keyReiniciar, setKeyReiniciar] = useState(0);

    // ==================== FUNÇÕES AUXILIARES ====================
  
  /**
   * Carrega a lista de usuários do backend
   */
  const carregarUsuarios = async () => {
    try {
      const usuarios = await usuariosService.findAll();
      setListaUsuarios(usuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  // ==================== EFEITOS ====================
  useEffect(() => {
    // Carrega a lista de usuários ao montar o componente
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarUsuarios();
  }, []);

  /**
   * Valida os dados do usuário usando Zod
   * @returns Dados validados ou null se houver erro
   */
  const validarUsuario = (usuario: IUsuario): IUsuario | null => {
    setErrors({});
    
    const result = usuarioSchema.safeParse(usuario);
    
    if (!result.success) {
      const errosFormatados: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errosFormatados[err.path[0] as string] = err.message;
        }
      });
      setErrors(errosFormatados);
      return null;
    }
    
    return result.data;
  };

  /**
   * Verifica se é uma operação de edição (ID existe e não é vazio)
   */
  const isEdicao = (usuario: IUsuario): boolean => {
    return Boolean(usuario.id && usuario.id.trim() !== '');
  };

  /**
   * Limpa o formulário e reseta estados
   */
  const limparFormulario = () => {
    setUsuario(null);
    setErrors({});
    setKeyReiniciar(prev => prev + 1);
  };

  // ==================== HANDLERS ====================
  
  /**
   * Cria um novo usuário no backend
   */
  const handleCreate = async (usuario: IUsuario) => {
    try {
      // Remove a propriedade 'id' antes de enviar
      const { ...dadosNovoUsuario } = usuario;
      
      const novoUsuario = await usuariosService.create(dadosNovoUsuario as IUsuario);
      setListaUsuarios((listaAtual) => [...listaAtual, novoUsuario]);
      limparFormulario();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  /**
   * Atualiza um usuário existente no backend
   */
  const handleUpdate = async (usuario: IUsuario) => {
    try {
      await usuariosService.update(usuario.id!, usuario);
      setListaUsuarios((listaAtual) =>
        listaAtual.map((u) => (u.id === usuario.id ? usuario : u))
      );
      limparFormulario();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  /**
   * Salva usuário (cria ou edita baseado no ID)
   */
  const handleSave = (usuario: IUsuario) => {
    const usuarioValidado = validarUsuario(usuario);
    
    if (!usuarioValidado) {
      return; // Validação falhou, erros já foram setados
    }

    if (isEdicao(usuarioValidado)) {
      handleUpdate(usuarioValidado);
    } else {
      handleCreate(usuarioValidado);
    }
  };

  /**
   * Cancela a operação atual e limpa o formulário
   */
  const handleCancel = () => {
    limparFormulario();
  };

  /**
   * Prepara o formulário para edição de um usuário
   */
  const handleEdit = (usuario: IUsuario) => {
    setUsuario(usuario);
    setErrors({});
  };

  /**
   * Exclui um usuário do backend
   */
  const handleDelete = async (usuarioId: string) => {
    try {
      await usuariosService.delete(usuarioId);
      setListaUsuarios((listaAtual) => listaAtual.filter((u) => u.id !== usuarioId));
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="row">
      {/* Formulário */}
      <div className="col-12 col-md-5 mb-4">
        <UsuarioForm
          key={usuario ? usuario.id : `new-${keyReiniciar}`}
          usuario={usuario}
          onSave={handleSave}
          onCancel={handleCancel}
          errors={errors}
        />
      </div>

      {/* Tabela */}
      <div className="col-12 col-md-7">
        <div className="card shadow">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold text-dark">Alunos Cadastrados</h5>
          </div>
          <div className="card-body p-0">
            <UsuarioTable
              usuarios={listaUsuarios}
              onEdit={handleEdit}
              onDelete={handleDelete}
              usuarioEmEdicao={usuario}
            />
          </div>
        </div>
      </div>
    </div>
  );
};