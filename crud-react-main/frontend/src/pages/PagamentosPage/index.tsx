import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

interface IUser {
  id: string;
  nome: string;
}

interface IPlano {
  id: string;
  nome: string;
  preco: number;
  duracaoMeses: number;
}

interface IPagamento {
  id: string;
  idAssinatura: string;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}

interface IAssinatura {
  id: string;
  idUsuario: string;
  idPlano: string;
  dataInicio: string;
  dataFim: string;
}

export const PagamentosPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [planos, setPlanos] = useState<IPlano[]>([]);
  const [pagamentos, setPagamentos] = useState<IPagamento[]>([]);
  const [assinaturas, setAssinaturas] = useState<IAssinatura[]>([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPlanoId, setSelectedPlanoId] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("Cartão de Crédito");
  
  const [receipt, setReceipt] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [uData, pData, payData, assData] = await Promise.all([
        apiService.getAll<IUser>("usuarios"),
        apiService.getAll<IPlano>("planos"),
        apiService.getAll<IPagamento>("pagamentos"),
        apiService.getAll<IAssinatura>("assinaturas"),
      ]);
      setUsers(uData);
      setPlanos(pData);
      setPagamentos(payData);
      setAssinaturas(assData);

      if (uData.length > 0) setSelectedUserId(uData[0].id);
      if (pData.length > 0) setSelectedPlanoId(pData[0].id);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados do simulador de pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedPlanoId) return;

    const user = users.find((u) => u.id === selectedUserId);
    const plano = planos.find((p) => p.id === selectedPlanoId);

    if (!user || !plano) return;

    try {
      const today = new Date();
      const dataInicio = today.toISOString().split("T")[0];
      
      const endDate = new Date();
      endDate.setMonth(today.getMonth() + plano.duracaoMeses);
      const dataFim = endDate.toISOString().split("T")[0];

      const assId = "ass" + Math.floor(1000 + Math.random() * 9000);
      const newAssinatura: IAssinatura = {
        id: assId,
        idUsuario: selectedUserId,
        idPlano: selectedPlanoId,
        dataInicio,
        dataFim,
      };

      await apiService.create<IAssinatura>("assinaturas", newAssinatura);
      setAssinaturas((prev) => [...prev, newAssinatura]);

      const transacaoId = "TX-" + Math.floor(100000 + Math.random() * 900000);
      const newPagamento: IPagamento = {
        id: "pag" + Math.floor(1000 + Math.random() * 9000),
        idAssinatura: assId,
        valorPago: plano.preco,
        dataPagamento: dataInicio,
        metodoPagamento,
        idTransacaoGateway: transacaoId,
      };

      const createdPayment = await apiService.create<IPagamento>("pagamentos", newPagamento);
      setPagamentos((prev) => [createdPayment, ...prev]);

      setReceipt({
        aluno: user.nome,
        plano: plano.nome,
        valor: plano.preco,
        metodo: metodoPagamento,
        transacao: transacaoId,
        dataFim,
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao realizar o pagamento.");
    }
  };

  const getStudentNameForPayment = (idAssinatura: string) => {
    const ass = assinaturas.find((a) => a.id === idAssinatura);
    if (!ass) return "N/A";
    return users.find((u) => u.id === ass.idUsuario)?.nome || "Aluno Excluído";
  };

  const getPlanoNameForPayment = (idAssinatura: string) => {
    const ass = assinaturas.find((a) => a.id === idAssinatura);
    if (!ass) return "N/A";
    return planos.find((p) => p.id === ass.idPlano)?.nome || "Plano Excluído";
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
              <h5 className="mb-0 fw-bold text-primary">Simulador de Checkout</h5>
            </div>
            <div className="card-body">
              {receipt ? (
                <div className="bg-success bg-opacity-10 border border-success p-4 rounded text-center mb-3">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i>
                  <h5 className="fw-bold text-success">Pagamento Confirmado!</h5>
                  <hr className="border-success" />
                  <div className="text-start small text-dark">
                    <p className="mb-1"><strong>Aluno:</strong> {receipt.aluno}</p>
                    <p className="mb-1"><strong>Plano:</strong> {receipt.plano}</p>
                    <p className="mb-1"><strong>Valor:</strong> R$ {receipt.valor.toFixed(2).replace(".", ",")}</p>
                    <p className="mb-1"><strong>Método:</strong> {receipt.metodo}</p>
                    <p className="mb-1"><strong>Transação:</strong> <code className="text-primary">{receipt.transacao}</code></p>
                    <p className="mb-0"><strong>Validade Assinatura:</strong> {receipt.dataFim}</p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-success mt-4 w-100 fw-bold"
                    onClick={() => setReceipt(null)}
                  >
                    Novo Checkout
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmCheckout}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Usuário (Aluno)</label>
                    <select
                      className="form-select"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      required
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Plano de Assinatura</label>
                    <select
                      className="form-select"
                      value={selectedPlanoId}
                      onChange={(e) => setSelectedPlanoId(e.target.value)}
                      required
                    >
                      {planos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} - R$ {p.preco.toFixed(2).replace(".", ",")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Método de Pagamento</label>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payMethod"
                        id="payCard"
                        value="Cartão de Crédito"
                        checked={metodoPagamento === "Cartão de Crédito"}
                        onChange={() => setMetodoPagamento("Cartão de Crédito")}
                      />
                      <label className="form-check-label" htmlFor="payCard">
                        <i className="bi bi-credit-card me-2"></i> Cartão de Crédito
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payMethod"
                        id="payPix"
                        value="PIX"
                        checked={metodoPagamento === "PIX"}
                        onChange={() => setMetodoPagamento("PIX")}
                      />
                      <label className="form-check-label" htmlFor="payPix">
                        <i className="bi bi-qr-code me-2"></i> PIX
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payMethod"
                        id="payBoleto"
                        value="Boleto Bancário"
                        checked={metodoPagamento === "Boleto Bancário"}
                        onChange={() => setMetodoPagamento("Boleto Bancário")}
                      />
                      <label className="form-check-label" htmlFor="payBoleto">
                        <i className="bi bi-file-earmark-text me-2"></i> Boleto Bancário
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-bold"
                    disabled={users.length === 0 || planos.length === 0}
                  >
                    Confirmar Checkout <i className="bi bi-arrow-right-short ms-1"></i>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">Transações de Pagamento</h5>
            </div>
            <div className="card-body p-0">
              {loading && pagamentos.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Usuário</th>
                        <th>Plano</th>
                        <th>Valor / Método</th>
                        <th className="px-4">ID Transação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagamentos.map((pay) => (
                        <tr key={pay.id}>
                          <td className="px-4 fw-semibold text-primary">
                            {getStudentNameForPayment(pay.idAssinatura)}
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {getPlanoNameForPayment(pay.idAssinatura)}
                            </span>
                          </td>
                          <td>
                            R$ {pay.valorPago.toFixed(2).replace(".", ",")}{" "}
                            <span className="text-muted d-block small">{pay.metodoPagamento}</span>
                          </td>
                          <td className="px-4 fw-mono text-muted small">{pay.idTransacaoGateway}</td>
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
export default PagamentosPage;
