"use client";

import { useContext, useState } from "react";
import estilo from "./estiloFormRelatorio.module.css";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import { calcularEstatisticasPeriodo } from "../funcoesRelatorio";

interface EstatisticasPeriodo {
  totalEntregas: number;
  valorTotal: number;
  entregasPorMotorista: Record<string, number>;
}

export default function FormularioRelatorio() {
  const { setFiltrosRelatorio } = useContext(ContextEntregasClientes);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formData = new FormData(ev.currentTarget);

    setFiltrosRelatorio({
      dataInicio: formData.get("dataInicio") as string,
      dataFim: formData.get("dataFim") as string,
      motorista: formData.get("motoristaRelatorio") as string,
      valorMinimo:
        (formData.get("valorMinimoEntregaRelatorio") as string) || "0",
      valorMaximo: formData.get("valorMaximoEntregaRelatorio") as string,
    });
  };

  return (
    <form className={estilo.stFormRelatorio} onSubmit={handleSubmit}>
      <div className="w-full">
        <div className={estilo.informsLabel}>
          <input
            type="date"
            name="dataInicio"
            id="initDataId"
            placeholder="Data de inicio do relatório"
          />
          <label htmlFor="dataInicio">Data de inicio do relatório</label>
        </div>
        <div className={estilo.informsLabel}>
          <input
            type="date"
            name="dataFim"
            id="initFimId"
            placeholder="Data do fim do relatório"
          />
          <label htmlFor="dataFim">Data do fim do relatório</label>
        </div>
        <div className={estilo.informsLabel}>
          <select name="motoristaRelatorio" id="idMotoraRelatorio">
            <option value="todos">Todos os Motoristas</option>
            <option value="Marcos">Marcos</option>
            <option value="Uene">Uene</option>
            <option value="Leo">Leo</option>
            <option value="João">João</option>
          </select>
          <label htmlFor="motoristaRelatorio">Entregador</label>
        </div>
        <div className={estilo.informsLabel}>
          <input
            type="number"
            name="valorMinimoEntregaRelatorio"
            id="idValorRelatorio"
            placeholder="R$ 100,00"
          />
          <label htmlFor="valorMinimoEntregaRelatorio">
            Valor mínimo da Entrega
          </label>
        </div>
        <div className={estilo.informsLabel}>
          <input
            type="number"
            name="valorMaximoEntregaRelatorio"
            id="idValorMaxRelatorio"
            placeholder="R$ 0,00"
          />
          <label htmlFor="valorMinimoEntregaRelatorio">
            Valor Máximo da Entrega
          </label>
        </div>
        <button
          className={`${estilo.informsButtonInitRel} w-full`}
          type="submit"
        >
          GERAR RELATÓRIO DE ENTREGAS
        </button>
      </div>
    </form>
  );
}
