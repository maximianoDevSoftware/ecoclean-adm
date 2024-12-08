"use client";

import { useContext, useState, useMemo } from "react";
import estilo from "./tabelasSty.module.css";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import getSocket from "@/socket/socketCliente";
import { entregasTipo } from "@/types/entregasTypes";

const socket = getSocket();

export default function TabelaEntregasDaSemana() {
  const { entregasRelatorio, filtrosRelatorio, atualizandoEntregasRelatorio } =
    useContext(ContextEntregasClientes);
  const [editandoStatus, setEditandoStatus] = useState<string | null>(null);
  const [editandoMotorista, setEditandoMotorista] = useState<string | null>(
    null
  );
  const [editandoValor, setEditandoValor] = useState<string | null>(null);
  const [editandoNome, setEditandoNome] = useState<string | null>(null);

  const entregasFiltradas = useMemo(() => {
    if (!entregasRelatorio) return [];

    // Primeiro ordenamos todas as entregas por data (mais recentes primeiro)
    const entregasOrdenadas = [...entregasRelatorio].sort((a, b) => {
      const dataA = new Date(a.dia[2], a.dia[1] - 1, a.dia[0]);
      const dataB = new Date(b.dia[2], b.dia[1] - 1, b.dia[0]);
      return dataB.getTime() - dataA.getTime(); // Ordem decrescente
    });

    // Depois aplicamos os filtros
    return entregasOrdenadas.filter((entrega) => {
      // Verifica datas
      if (filtrosRelatorio.dataInicio && filtrosRelatorio.dataFim) {
        const [diaEntrega, mesEntrega, anoEntrega] = entrega.dia;

        const dataInicio = new Date(filtrosRelatorio.dataInicio + "T00:00:00");
        const dataFim = new Date(filtrosRelatorio.dataFim + "T23:59:59");
        const dataEntrega = new Date(anoEntrega, mesEntrega - 1, diaEntrega);

        if (dataEntrega < dataInicio || dataEntrega > dataFim) {
          return false;
        }
      }

      // Verifica motorista
      if (
        filtrosRelatorio.motorista !== "todos" &&
        entrega.entregador !== filtrosRelatorio.motorista
      ) {
        return false;
      }

      // Verifica valor mínimo
      const valorEntrega = Number(entrega.valor.replace(",", "."));
      const valorMinimo = Number(filtrosRelatorio.valorMinimo) || 0;
      if (valorEntrega < valorMinimo) return false;

      // Verifica valor máximo
      if (filtrosRelatorio.valorMaximo) {
        const valorMaximo = Number(filtrosRelatorio.valorMaximo);
        if (valorEntrega > valorMaximo) return false;
      }

      return true;
    });
  }, [entregasRelatorio, filtrosRelatorio]);

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/\D/g, "");
    const valorNumerico = Number(numero) / 100;
    return valorNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleStatusChange = (entrega: entregasTipo, novoStatus: string) => {
    const entregaAtualizada = { ...entrega, status: novoStatus };
    socket.emit("Atualizar Entrega", entregaAtualizada);
    setEditandoStatus(null);
    atualizandoEntregasRelatorio();
  };

  const handleMotoristaChange = (
    entrega: entregasTipo,
    novoMotorista: string
  ) => {
    const entregaAtualizada = { ...entrega, entregador: novoMotorista };
    socket.emit("Atualizar Entrega", entregaAtualizada);
    setEditandoMotorista(null);
    atualizandoEntregasRelatorio();
  };

  const handleValorChange = (entrega: entregasTipo, novoValor: string) => {
    const valorFormatado = formatarMoeda(novoValor);
    const entregaAtualizada = {
      ...entrega,
      valor: valorFormatado.replace("R$", "").trim(),
    };
    socket.emit("Atualizar Entrega", entregaAtualizada);
    setEditandoValor(null);
    atualizandoEntregasRelatorio();
  };

  const handleNomeChange = (entrega: entregasTipo, novoNome: string) => {
    const entregaAtualizada = {
      ...entrega,
      nome: novoNome,
    };
    socket.emit("Atualizar Entrega", entregaAtualizada);
    setEditandoNome(null);
    atualizandoEntregasRelatorio();
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className={`${estilo.tabelaSemana}`}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>Motorista</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {entregasFiltradas.map((entrega, index) => {
            return (
              <tr key={index}>
                <td
                  className={`${estilo.campoNome} cursor-pointer hover:bg-gray-700`}
                  onClick={() => entrega.id && setEditandoNome(entrega.id)}
                >
                  {editandoNome === entrega.id ? (
                    <input
                      type="text"
                      defaultValue={entrega.nome}
                      className={estilo.inputValor}
                      autoFocus
                      onBlur={(e) => handleNomeChange(entrega, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleNomeChange(entrega, e.currentTarget.value);
                        }
                      }}
                    />
                  ) : (
                    entrega.nome
                  )}
                </td>
                <td
                  className={`${estilo.campoStatus} cursor-pointer hover:bg-gray-700`}
                  onClick={() => entrega.id && setEditandoStatus(entrega.id)}
                >
                  {editandoStatus === entrega.id ? (
                    <select
                      value={entrega.status}
                      onChange={(e) =>
                        handleStatusChange(entrega, e.target.value)
                      }
                      className={estilo.selectStatus}
                      autoFocus
                      onBlur={() => setEditandoStatus(null)}
                    >
                      <option value="Disponível">Disponível</option>
                      <option value="Andamento">Andamento</option>
                      <option value="Concluída">Concluída</option>
                    </select>
                  ) : (
                    entrega.status
                  )}
                </td>
                <td
                  className={`${estilo.campoMotorista} cursor-pointer hover:bg-gray-700`}
                  onClick={() => entrega.id && setEditandoMotorista(entrega.id)}
                >
                  {editandoMotorista === entrega.id ? (
                    <select
                      value={entrega.entregador}
                      onChange={(e) =>
                        handleMotoristaChange(entrega, e.target.value)
                      }
                      className={estilo.selectStatus}
                      autoFocus
                      onBlur={() => setEditandoMotorista(null)}
                    >
                      <option value="Marcos">Marcos</option>
                      <option value="Uene">Uene</option>
                      <option value="Leo">Leo</option>
                      <option value="João">João</option>
                    </select>
                  ) : (
                    entrega.entregador
                  )}
                </td>
                <td
                  className={`${estilo.campoValor} cursor-pointer hover:bg-gray-700`}
                  onClick={() => entrega.id && setEditandoValor(entrega.id)}
                >
                  {editandoValor === entrega.id ? (
                    <input
                      type="text"
                      defaultValue={entrega.valor}
                      className={estilo.inputValor}
                      autoFocus
                      onBlur={(e) => handleValorChange(entrega, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleValorChange(entrega, e.currentTarget.value);
                        }
                      }}
                    />
                  ) : (
                    `R$ ${entrega.valor}`
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
