"use client";

import { useContext, useEffect, useState } from "react";
import estilo from "../telaRel.module.css";
import { entregasTipo } from "@/types/entregasTypes";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import { valorConjuntoEntrega } from "./funcoesRelatorio";

export function MotoristasRelatorio() {
  const { entregasRelatorio } = useContext(ContextEntregasClientes);
  const [estatisticasMotoristas, setEstatisticasMotoristas] = useState<{
    [key: string]: {
      totalEntregas: number;
      entregasConcluidas: number;
      valorTotal: number;
      mediaEntregasDia: number;
    };
  }>({});

  useEffect(() => {
    if (!entregasRelatorio) return;

    const motoristas = ["Marcos", "Uene", "Leo", "João"];
    const hoje = new Date();
    const diaAtual = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

    const novasEstatisticas = motoristas.reduce((acc, motorista) => {
      const entregasMotorista = entregasRelatorio.filter(
        (entrega) => entrega.entregador === motorista
      );

      const entregasConcluidas = entregasMotorista.filter(
        (entrega) => entrega.status === "Concluída"
      );

      const entregasHoje = entregasConcluidas.filter(
        (entrega) =>
          entrega.dia[0] === diaAtual[0] &&
          entrega.dia[1] === diaAtual[1] &&
          entrega.dia[2] === diaAtual[2]
      );

      acc[motorista] = {
        totalEntregas: entregasMotorista.length,
        entregasConcluidas: entregasConcluidas.length,
        valorTotal: valorConjuntoEntrega(entregasConcluidas),
        mediaEntregasDia: entregasHoje.length,
      };

      return acc;
    }, {} as any);

    setEstatisticasMotoristas(novasEstatisticas);
  }, [entregasRelatorio]);

  return (
    <div className={estilo.telaInfosMotoristaRel}>
      <h1 className={estilo.tituloRelatorioMotoristas}>
        Relatório por Motorista
      </h1>
      <div className={estilo.gridMotoristas}>
        {Object.entries(estatisticasMotoristas).map(([motorista, stats]) => (
          <div key={motorista} className={estilo.cardMotorista}>
            <h2 className={estilo.nomeMotorista}>{motorista}</h2>
            <div className={estilo.estatisticas}>
              <p>Total de Entregas: {stats.totalEntregas}</p>
              <p>Entregas Concluídas: {stats.entregasConcluidas}</p>
              <p>Valor Total: R$ {stats.valorTotal.toFixed(2)}</p>
              <p>Média de Entregas/Dia: {stats.mediaEntregasDia}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
