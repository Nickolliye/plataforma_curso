import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

interface IPlano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMeses: number;
}

export const PlanosPage = () => {
  const [planos, setPlanos] = useState<IPlano[]>([]);
  
  const [pId, setPId] = useState("");
  const [pNome, setPNome] = useState("");
  const [pDescricao, setPDescricao] = useState("");
  const [pPreco, setPPreco] = useState(49.90);
  const [pDuracao, setPDuracao] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPlanos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<IPlano>("planos");
      setPlanos(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao se conectar ao banco de planos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanos();
  }, []);

  const handleSavePlano = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNome || pPreco <= 0 || pDuracao <= 0) return;

    const planoData = {
      nome: pNome,
      descricao: pDescricao,
      preco: Number(pPreco),
      duracaoMeses: Number(pDuracao),
    };

    try {
      if (pId) {
        const updated = await apiService.update<IPlano>("planos", pId, { ...planoData, id: pId });
        setPlanos((prev) => prev.map((p) => (p.id === pId ? updated : p)));
      } else {
        const created = await apiService.create<IPlano>("planos", {
          ...planoData,
          id: "pl" + Math.floor(1000 + Math.random() * 9000),
        });
        setPlanos((prev) => [...prev, created]);
      }
      handleCancel();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (plano: IPlano) => {
    setPId(plano.id);
    setPNome(plano.nome);
    setPDescricao(plano.descricao);
    setPPreco(plano.preco);
    setPDuracao(plano.duracaoMeses);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão deste plano?")) return;
    try {
      await apiService.delete("planos", id);
      setPlanos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setPId("");
    setPNome("");
    setPDescricao("");
    setPPreco(49.90);
    setPDuracao(1);
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger shadow-sm border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-12 col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                {pId ? "Editar Plano" : "Cadastrar Plano"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSavePlano}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nome do Plano</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Plano Anual, Plano Mensal"
                    value={pNome}
                    onChange={(e) => setPNome(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descrição</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Benefícios inclusos no plano..."
                    value={pDescricao}
                    onChange={(e) => setPDescricao(e.target.value)}
                  />
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={pPreco}
                      onChange={(e) => setPPreco(Number(e.target.value))}
                      min={0.01}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Duração (Meses)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={pDuracao}
                      onChange={(e) => setPDuracao(Number(e.target.value))}
                      min={1}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    {pId ? "Atualizar" : "Salvar"}
                  </button>
                  {pId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">Planos de Assinatura</h5>
            </div>
            <div className="card-body p-0">
              {loading && planos.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Plano</th>
                        <th>Preço</th>
                        <th>Validade</th>
                        <th className="text-end px-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planos.map((plano) => (
                        <tr key={plano.id}>
                          <td className="px-4">
                            <div className="fw-semibold text-primary">{plano.nome}</div>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "200px" }}>
                              {plano.descricao}
                            </small>
                          </td>
                          <td>
                            <strong>R$ {plano.preco.toFixed(2).replace(".", ",")}</strong>
                          </td>
                          <td>{plano.duracaoMeses} {plano.duracaoMeses === 1 ? "mês" : "meses"}</td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEdit(plano)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(plano.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlanosPage;
