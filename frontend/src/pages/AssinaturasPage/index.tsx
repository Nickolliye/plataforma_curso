import { useState, useEffect } from "react";
import { usuariosService } from "../../services/usuario.service";
import type { IUsuario } from "../../models/usuario.model";

export interface IAssinatura {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  plano: "Básico" | "Premium";
  valor: number;
  dataInicio: string;
  transacaoId: string;
}

export const AssinaturasPage = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState("");
  const [selectedPlano, setSelectedPlano] = useState<"Básico" | "Premium">("Premium");
  
  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  
  const [assinaturas, setAssinaturas] = useState<IAssinatura[]>([]);
  const [receipt, setReceipt] = useState<IAssinatura | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuariosService.findAll();
        setUsuarios(data);
        if (data.length > 0) {
          setSelectedUsuarioId(data[0].id || "");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários do backend:", error);
        // Fallback para mock
        const mockUsers = [
          { id: "137c", nome: "MONICA J. SILVA", email: "monica@gmail.com", senha: "", status: "ativo" as const },
          { id: "0f1d", nome: "MIGUEL C.", email: "miguel@gmail.com", senha: "", status: "ativo" as const }
        ];
        setUsuarios(mockUsers);
        setSelectedUsuarioId(mockUsers[0].id);
      }
    };

    fetchUsuarios();

    const savedAssinaturas = localStorage.getItem("sg_assinaturas");
    if (savedAssinaturas) {
      setAssinaturas(JSON.parse(savedAssinaturas));
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUsuarioId || !nomeCartao.trim() || !numeroCartao.trim()) return;

    const user = usuarios.find((u) => u.id === selectedUsuarioId);
    if (!user) return;

    const valor = selectedPlano === "Básico" ? 29.90 : 59.90;
    const transacaoId = "TX-" + Math.floor(100000 + Math.random() * 900000);
    const dataInicio = new Date().toLocaleDateString("pt-BR");

    const novaAssinatura: IAssinatura = {
      id: Math.random().toString(36).substr(2, 9),
      usuarioId: selectedUsuarioId,
      usuarioNome: user.nome,
      plano: selectedPlano,
      valor,
      dataInicio,
      transacaoId
    };

    const updated = [novaAssinatura, ...assinaturas];
    setAssinaturas(updated);
    localStorage.setItem("sg_assinaturas", JSON.stringify(updated));
    setReceipt(novaAssinatura);

    // Resetar form
    setNomeCartao("");
    setNumeroCartao("");
    setValidade("");
    setCvv("");
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <div className="card h-100 border-primary border-2 shadow-sm">
            <div className="card-body d-flex flex-column justify-content-between p-4">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-primary px-3 py-2 fs-6">PLANO PREMIUM</span>
                  <span className="text-muted fw-bold">Mais Vendido</span>
                </div>
                <h3 className="fw-bold mb-2">R$ 59,90<span className="fs-6 text-muted font-normal"> / mês</span></h3>
                <p className="text-muted">Acesso ilimitado a todas as trilhas, cursos, módulos, emissão de certificados oficiais e suporte personalizado.</p>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Todas as Trilhas inclusas</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Certificados ilimitados e válidos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Acesso offline de vídeos</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Suporte Prioritário</li>
                </ul>
              </div>
              <button 
                type="button" 
                className={`btn w-100 py-2.5 fw-bold ${selectedPlano === "Premium" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedPlano("Premium")}
              >
                {selectedPlano === "Premium" ? "Selecionado" : "Escolher Premium"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column justify-content-between p-4">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-secondary px-3 py-2 fs-6">PLANO BÁSICO</span>
                </div>
                <h3 className="fw-bold mb-2">R$ 29,90<span className="fs-6 text-muted font-normal"> / mês</span></h3>
                <p className="text-muted">Excelente opção para quem deseja aprender as bases da programação web sem custos adicionais de certificação.</p>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Acesso a 2 Trilhas principais</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i> Aulas em alta definição</li>
                  <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i> Sem certificado oficial</li>
                  <li className="mb-2"><i className="bi bi-x-circle-fill text-danger me-2"></i> Suporte comum por fórum</li>
                </ul>
              </div>
              <button 
                type="button" 
                className={`btn w-100 py-2.5 fw-bold ${selectedPlano === "Básico" ? "btn-secondary" : "btn-outline-secondary"}`}
                onClick={() => setSelectedPlano("Básico")}
              >
                {selectedPlano === "Básico" ? "Selecionado" : "Escolher Básico"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">Simulador de Assinatura & Checkout</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubscribe}>
                <div className="mb-3">
                  <label htmlFor="usuarioSelect" className="form-label fw-semibold">Selecionar Usuário para Matrícula</label>
                  <select
                    id="usuarioSelect"
                    className="form-select"
                    value={selectedUsuarioId}
                    onChange={(e) => setSelectedUsuarioId(e.target.value)}
                    required
                  >
                    {usuarios.length === 0 ? (
                      <option value="">Nenhum usuário cadastrado no sistema</option>
                    ) : (
                      usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nome} ({u.email})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="bg-light p-3 rounded mb-3">
                  <div className="d-flex justify-content-between fw-bold mb-1">
                    <span>Plano Escolhido:</span>
                    <span className="text-primary">{selectedPlano}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Valor Mensal:</span>
                    <span>R$ {selectedPlano === "Básico" ? "29,90" : "59,90"}</span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="cardNome" className="form-label fw-semibold">Nome no Cartão</label>
                    <input
                      type="text"
                      id="cardNome"
                      className="form-control"
                      placeholder="EX: MONICA J SILVA"
                      value={nomeCartao}
                      onChange={(e) => setNomeCartao(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="cardNum" className="form-label fw-semibold">Número do Cartão</label>
                    <input
                      type="text"
                      id="cardNum"
                      className="form-control"
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      value={numeroCartao}
                      onChange={(e) => setNumeroCartao(e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="cardVal" className="form-label fw-semibold">Validade</label>
                    <input
                      type="text"
                      id="cardVal"
                      className="form-control"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={validade}
                      onChange={(e) => setValidade(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="cardCvv" className="form-label fw-semibold">CVV</label>
                    <input
                      type="password"
                      id="cardCvv"
                      className="form-control"
                      placeholder="***"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 py-2.5 fw-bold"
                  disabled={usuarios.length === 0}
                >
                  <i className="bi bi-credit-card-fill me-2"></i> Finalizar Assinatura
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          {receipt ? (
            <div className="card bg-dark text-white border-0 shadow mb-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="bg-success rounded-circle d-inline-flex p-3 mb-3">
                    <i className="bi bi-patch-check-fill fs-2 text-white"></i>
                  </div>
                  <h4 className="fw-bold text-success">Pagamento Confirmado!</h4>
                  <p className="text-muted">Abaixo estão os detalhes da sua assinatura oficial.</p>
                </div>
                
                <hr className="border-secondary" />
                
                <div className="mb-3">
                  <span className="text-muted d-block text-uppercase small">ID da Transação</span>
                  <span className="fw-mono text-info">{receipt.transacaoId}</span>
                </div>
                <div className="mb-3">
                  <span className="text-muted d-block text-uppercase small">Aluno Beneficiário</span>
                  <span className="fw-bold">{receipt.usuarioNome}</span>
                </div>
                <div className="mb-3">
                  <span className="text-muted d-block text-uppercase small">Plano</span>
                  <span className="badge bg-primary">{receipt.plano}</span>
                </div>
                <div className="mb-3">
                  <span className="text-muted d-block text-uppercase small">Data de Início</span>
                  <span>{receipt.dataInicio}</span>
                </div>
                <div className="mb-3">
                  <span className="text-muted d-block text-uppercase small">Valor Debitado</span>
                  <span className="fs-5 fw-bold text-success">R$ {receipt.valor.toFixed(2).replace(".", ",")} / mês</span>
                </div>

                <button 
                  className="btn btn-outline-light w-100 mt-3"
                  onClick={() => setReceipt(null)}
                >
                  Nova Simulação
                </button>
              </div>
            </div>
          ) : (
            <div className="card shadow mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-dark">Assinaturas Recentes</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Aluno</th>
                        <th>Plano</th>
                        <th className="px-4">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assinaturas.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-4 text-muted">
                            Nenhuma assinatura efetuada nesta sessão.
                          </td>
                        </tr>
                      ) : (
                        assinaturas.slice(0, 5).map((ass) => (
                          <tr key={ass.id}>
                            <td className="px-4">
                              <span className="fw-semibold">{ass.usuarioNome}</span>
                            </td>
                            <td>
                              <span className={`badge ${ass.plano === "Premium" ? "bg-primary" : "bg-secondary"}`}>
                                {ass.plano}
                              </span>
                            </td>
                            <td className="px-4">{ass.dataInicio}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
