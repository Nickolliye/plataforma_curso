import { useEffect, useState } from "react";
import type { IUsuario } from "../../models/usuario.model";
import { usuarioSchema } from "../../models/usuario.model";
import apiService from "../../services/api.service";
import { UsuarioForm } from "./UsuarioForm";
import { UsuarioTable } from "./UsuarioTable";

export const UsuarioPages = () => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [listaUsuarios, setListaUsuarios] = useState<IUsuario[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keyReiniciar, setKeyReiniciar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setApiError("");
      const usuarios = await apiService.getAll<IUsuario>("usuarios");
      setListaUsuarios(usuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setApiError("Não foi possível conectar com o backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const validarUsuario = (user: IUsuario): IUsuario | null => {
    setErrors({});
    const result = usuarioSchema.safeParse(user);
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

  const limparFormulario = () => {
    setUsuario(null);
    setErrors({});
    setKeyReiniciar((prev) => prev + 1);
  };

  const handleSave = async (user: IUsuario) => {
    const usuarioValidado = validarUsuario(user);
    if (!usuarioValidado) return;

    try {
      setApiError("");
      if (user.id) {
        const updated = await apiService.update<IUsuario>("usuarios", user.id, {
          ...usuarioValidado,
          dataCadastro: user.dataCadastro || new Date().toISOString().split("T")[0]
        });
        setListaUsuarios((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      } else {
        const data = {
          ...usuarioValidado,
          id: "u" + Math.floor(1000 + Math.random() * 9000),
          dataCadastro: new Date().toISOString().split("T")[0]
        };
        const created = await apiService.create<IUsuario>("usuarios", data);
        setListaUsuarios((prev) => [...prev, created]);
      }
      limparFormulario();
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      setApiError("Erro ao salvar o registro no banco de dados.");
    }
  };

  const handleEdit = (user: IUsuario) => {
    setUsuario(user);
    setErrors({});
  };

  const handleDelete = async (usuarioId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      setApiError("");
      await apiService.delete("usuarios", usuarioId);
      setListaUsuarios((prev) => prev.filter((u) => u.id !== usuarioId));
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setApiError("Erro ao remover o usuário.");
    }
  };

  return (
    <div>
      {apiError && (
        <div className="alert alert-danger shadow-sm border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {apiError}
        </div>
      )}

      {loading && listaUsuarios.length === 0 ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-md-5 mb-4">
            <UsuarioForm
              key={usuario ? usuario.id : `new-${keyReiniciar}`}
              usuario={usuario}
              onSave={handleSave}
              onCancel={limparFormulario}
              errors={errors}
            />
          </div>

          <div className="col-12 col-md-7">
            <div className="card shadow-sm border-0">
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
      )}
    </div>
  );
};
export default UsuarioPages;