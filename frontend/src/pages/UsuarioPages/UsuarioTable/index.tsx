import type { IUsuario } from "../../../models/usuario.model";


interface UsuarioTableProps {
    usuarios: IUsuario[];
    onEdit: (usuario: IUsuario) => void;
    usuarioEmEdicao: IUsuario | null;
}

export const UsuarioTable = (
    { usuarios, onEdit, onDelete, usuarioEmEdicao }: UsuarioTableProps) => {

    return (
        <>
        <div className="table-responsive">
            <table className="table table-striped table-hover mb-0 align-middle">
                <thead className="table-light">
                    <tr>
                        <th className="px-4">ID</th>
                        <th>NOME</th>
                        <th>E-MAIL</th>
                        <th>STATUS</th>
                        <th className="text-end px-4">AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => {
                        const desabilitado = !!usuarioEmEdicao;
                        return (
                             <tr key={usuario.id}>
                                 <td className="px-4 fw-mono text-muted">{usuario.id}</td>
                                 <td className="fw-semibold text-primary">{usuario.nome}</td>
                                 <td>{usuario.email}</td>
                                 <td>
                                     <span className={`badge ${usuario.status === "ativo" ? "bg-success" : "bg-secondary"}`}>
                                         {usuario.status}
                                     </span>
                                 </td>
                                 <td className="text-end px-4">
                                     <div className="d-flex gap-2 justify-content-end">
                                         <button
                                             className="btn btn-sm btn-outline-warning"
                                             onClick={() => onEdit(usuario)}
                                             disabled={desabilitado}
                                         >
                                             <i className="bi bi-pencil-square"></i>
                                         </button>
                                         <button
                                             className="btn btn-sm btn-outline-danger"
                                             onClick={() => onDelete(usuario.id || "")}
                                             disabled={desabilitado}
                                         >
                                             <i className="bi bi-trash"></i>
                                         </button>
                                     </div>
                                 </td>
                             </tr>
                         );
                     })}
                 </tbody>
             </table>
         </div>
     </>
    );
}