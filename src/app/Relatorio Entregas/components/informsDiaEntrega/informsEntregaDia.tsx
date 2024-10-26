"use client";
import { TbTruckDelivery } from "react-icons/tb";
import estilo from "./diaInfo.module.css";
import { useContext, useEffect } from "react";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";

export function ComponenteRelatDia() {
  const { entregasRelatorio } = useContext(ContextEntregasClientes);

  const entregasDisponiveis = entregasRelatorio?.filter((entrega) => {
    if (entrega.status === "Disponível") {
      return entrega;
    }
  });

  const entregasAndamento = entregasRelatorio?.filter((entrega) => {
    if (entrega.status === "Entregando") {
      return entrega;
    }
  });

  // Obter a data de hoje dinamicamente
  const hoje = new Date();
  const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

  const entregasConcluidas = entregasRelatorio?.filter((entrega) => {
    if (entrega.status === "Concluída") {
      if (entrega.dia[0] === diaHoje[0] && entrega.dia[1] === diaHoje[1]) {
        return entrega;
      }
    }
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
          <div className={`${estilo.motoraEntregasDia}`}>
            1 <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoUeneEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia}`}>
            3 <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoLeoEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia}`}>
            4 <TbTruckDelivery className="inline size-5" />
          </div>
        </div>
        <div className={`${estilo.areaFotoEntregaDia}`}>
          <div
            className={`${estilo.fotoEntregasDia} ${estilo.fotoJoaoEntregasDia}`}
          ></div>
          <div className={`${estilo.motoraEntregasDia}`}>
            5 <TbTruckDelivery className="inline size-5" />
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
