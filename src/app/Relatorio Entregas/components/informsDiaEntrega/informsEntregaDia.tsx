"use client";
import { TbTruckDelivery } from "react-icons/tb";
import estilo from "./diaInfo.module.css";
import { useContext, useEffect, useMemo } from "react";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";

export function ComponenteRelatDia() {
  const { entregasRelatorio } = useContext(ContextEntregasClientes);

  const hoje = new Date();
  const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

  const entregasPorMotorista = useMemo(() => {
    if (!entregasRelatorio) return {};

    return entregasRelatorio.reduce((acc, entrega) => {
      if (
        entrega.dia[0] === diaHoje[0] &&
        entrega.dia[1] === diaHoje[1] &&
        entrega.dia[2] === diaHoje[2]
      ) {
        const motorista = entrega.entregador;
        acc[motorista] = (acc[motorista] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [entregasRelatorio, diaHoje]);

  const entregasDisponiveis = entregasRelatorio?.filter((entrega) => {
    return (
      entrega.status === "Disponível" &&
      entrega.dia[0] === diaHoje[0] &&
      entrega.dia[1] === diaHoje[1] &&
      entrega.dia[2] === diaHoje[2]
    );
  });

  const entregasAndamento = entregasRelatorio?.filter((entrega) => {
    return (
      entrega.status === "Entregando" &&
      entrega.dia[0] === diaHoje[0] &&
      entrega.dia[1] === diaHoje[1] &&
      entrega.dia[2] === diaHoje[2]
    );
  });

  const entregasConcluidas = entregasRelatorio?.filter((entrega) => {
    return (
      entrega.status === "Concluída" &&
      entrega.dia[0] === diaHoje[0] &&
      entrega.dia[1] === diaHoje[1] &&
      entrega.dia[2] === diaHoje[2]
    );
  });

  const FaturamentoDoDia = () => {
    if (entregasConcluidas) {
      let valorTotalDoDia = 0;
      entregasConcluidas.map((entrega) => {
        if (entrega.valor) {
          let valorAdapt = Number(entrega.valor.replace(",", "."));
          valorTotalDoDia += valorAdapt;
          console.log(valorAdapt);
        }
      });
      console.log("O valor total do dia foi de: " + valorTotalDoDia);
      let stringValorTotal = `R$ ${valorTotalDoDia.toFixed(2)}`;
      return stringValorTotal;
    } else {
      return `R$ 0,00`;
    }
  };

  useEffect(() => {
    console.log(
      "Número de entregas dispnníveis: " + entregasDisponiveis?.length
    );
    console.log("Número de entregas andamento: " + entregasAndamento?.length);
    console.log("Número de entregas concluidas: " + entregasConcluidas?.length);
  }, [entregasRelatorio]);

  return (
    <div className={`${estilo.areaInfoEntregaDia}`}>
      <div className={`${estilo.dispInfoDia}`}>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoMarcosEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia} relMarcosCont`}>
            {entregasPorMotorista["Marcos"] || 0}{" "}
            <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoUeneEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia} relUeneCont`}>
            {entregasPorMotorista["Uene"] || 0}{" "}
            <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoLeoEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia} relLeoCont`}>
            {entregasPorMotorista["Leo"] || entregasPorMotorista["Léo"] || 0}{" "}
            <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoJoaoEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia} relJoaoCont`}>
            {entregasPorMotorista["João"] || 0}{" "}
            <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
      </div>

      <div className={`${estilo.dispInfoDia}`}>
        <h3>
          Entregas Disponíveis:{" "}
          <span>{entregasDisponiveis ? entregasDisponiveis.length : "0"}</span>
        </h3>
        <h3>
          Entregas em Andamento:{" "}
          <span>{entregasAndamento ? entregasAndamento.length : "0"}</span>
        </h3>
        <h3>
          Entregas Concluídas:{" "}
          <span>{entregasConcluidas ? entregasConcluidas.length : "0"}</span>
        </h3>
      </div>

      <div className={`${estilo.dispInfoDia}`}>
        <h3>Faturamento do dia:</h3>
        <div className={`${estilo.spamFaturamento}`}>{FaturamentoDoDia()}</div>
      </div>
    </div>
  );
}
