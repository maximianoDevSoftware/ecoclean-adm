"use client";

import { useContext } from "react";
import estilo from "./telaRel.module.css";
import DoughnutChart from "./components/graficos/doughnut";
import LineChart from "./components/graficos/graficoLinha";
import TabelaEntregasDaSemana from "./components/tabelas/tabelaSemana";
import FormularioRelatorio from "./components/formRelatorio/formularioRlatorio";
import { ComponenteRelatDia } from "./components/informsDiaEntrega/informsEntregaDia";
import { contextAutenticacao } from "@/contexts/contextoUsuario";

export function TelaFullRelatEntregas() {
  const { usuarioLogado } = useContext(contextAutenticacao);

  return (
    usuarioLogado?.userName === "Administradores" && (
      <div
        className={`${estilo.telaFullRelatorioEntregas} ${estilo.telaFullRelatorioEntregasFora}`}
        id="telaFullRelatorioId"
        onClick={(ev) => {
          if (ev.target === ev.currentTarget) {
            ev.currentTarget.classList.add(
              estilo.telaFullRelatorioEntregasFora
            );
          }
        }}
      >
        <div
          className={`${estilo.containerMarrom} ${estilo.containerGridRelatorios}`}
        >
          <div className={`${estilo.tituloDisplay}`}>
            Relatório de Entregas:
          </div>
          <div className={`${estilo.informsGraficoDisplay}`}>
            <DoughnutChart></DoughnutChart>
            <LineChart></LineChart>
          </div>
          <div className={`${estilo.informsTabelaDisplay} roalgemPers`}>
            <TabelaEntregasDaSemana></TabelaEntregasDaSemana>
          </div>
          <div className={`${estilo.informsFormularioDisplay}`}>
            <FormularioRelatorio></FormularioRelatorio>
          </div>
          <div className={`${estilo.informsEntregasDiaDisplay}`}>
            <ComponenteRelatDia></ComponenteRelatDia>
          </div>

          {/* Parte da tela responsável por definir as entregas relizadas, das entregas realizadas, quantas foram de determinado motorista, e quanto ele movimentou com entregas para este motorista em específico */}
          {/* <MotoristasRelatorio /> */}
          {/*Parte do código responsável por relacionar as entregas do mes em um gráfico e exibir essas entregas  */}
          {/* <div
            className={`flex items-center justify-around w-[750px] relative`}
          > */}
          {/* <DoughnutChart></DoughnutChart> */}
          {/*Parte do código responsável  por ter uma lista direta com as entregas realizadas nas ultimas 2 semanas. Todas as entregas nessta tabela*/}
          {/* <LineChart></LineChart> */}
          {/* </div> */}
          {/* <div */}
          {/* className={`max-h-[280px] overflow-y-scroll absolute top-[20px] right-[10px] overflow-x-visible px-[50px]  roalgemPers`} */}
          {/* > */}
          {/* <TabelaEntregasDaSemana></TabelaEntregasDaSemana> */}
          {/* </div> */}
          {/* <FormularioRelatorio></FormularioRelatorio> */}
        </div>
      </div>
    )
  );
}
