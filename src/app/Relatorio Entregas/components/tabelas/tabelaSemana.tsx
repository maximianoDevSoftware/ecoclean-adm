"use client";

import { useContext } from "react";
import estilo from "./tabelasSty.module.css";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";

export default function TabelaEntregasDaSemana() {
  const { entregasRelatorio } = useContext(ContextEntregasClientes);

  const hoje = new Date();
  const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

  const entregasConcluidas = entregasRelatorio?.filter((entrega) => {
    if (
      (entrega.dia[0] === diaHoje[0] && entrega.dia[1] === diaHoje[1]) ||
      entrega.status == "Disponível"
    ) {
      return entrega;
    }
  });

  return (
    <table className={`${estilo.tabelaSemana}`}>
      <thead>
        <tr>
          <th>Nome da entrega:</th>
          <th>Status da entrega:</th>
          <th>Motorista:</th>
          <th>Valor:</th>
        </tr>
      </thead>
      <tbody>
        {entregasConcluidas?.map((entrega, index) => {
          return (
            <tr key={index}>
              <td className={`${estilo.campoNome}`}>{entrega.nome}</td>
              <td className={`${estilo.campoStatus}`}>{entrega.status}</td>
              <td className={`${estilo.campoMotorista}`}>
                {entrega.entregador}
              </td>
              <td className={`${estilo.campoValor}`}>R$ {entrega.valor}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
