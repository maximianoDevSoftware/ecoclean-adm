"use client";

import { useContext, useEffect, useRef } from "react";
import estilo from "./telaRel.module.css";
import DoughnutChart from "./components/graficos/doughnut";
import LineChart from "./components/graficos/graficoLinha";
import TabelaEntregasDaSemana from "./components/tabelas/tabelaSemana";
import FormularioRelatorio from "./components/formRelatorio/formularioRlatorio";
import { ComponenteRelatDia } from "./components/informsDiaEntrega/informsEntregaDia";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import { RelatorioContext } from "@/contexts/relatorioContext";

export function TelaFullRelatEntregas() {
  const { usuarioLogado } = useContext(contextAutenticacao);
  const { isVisible, setIsVisible } = useContext(RelatorioContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const animarElementos = () => {
    if (!containerRef.current) return;
    containerRef.current.classList.add(estilo.containerMarromAtivo);

    setTimeout(() => {
      const titulo = containerRef.current?.querySelector(
        `.${estilo.tituloDisplay}`
      );
      titulo?.classList.add(estilo.tituloDisplayAtivo);
    }, 500);

    setTimeout(() => {
      const graficos = containerRef.current?.querySelector(
        `.${estilo.informsGraficoDisplay}`
      );
      graficos?.classList.add(estilo.informsGraficoDisplayAtivo);
    }, 700);

    setTimeout(() => {
      const tabela = containerRef.current?.querySelector(
        `.${estilo.informsTabelaDisplay}`
      );
      tabela?.classList.add(estilo.informsTabelaDisplayAtivo);
    }, 900);

    setTimeout(() => {
      const formulario = containerRef.current?.querySelector(
        `.${estilo.informsFormularioDisplay}`
      );
      formulario?.classList.add(estilo.informsFormularioDisplayAtivo);
    }, 1100);

    setTimeout(() => {
      const entregasDia = containerRef.current?.querySelector(
        `.${estilo.informsEntregasDiaDisplay}`
      );
      entregasDia?.classList.add(estilo.informsEntregasDiaDisplayAtivo);
    }, 1300);
  };

  const desanimarElementos = (callback: () => void) => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Primeiro remove as classes dos últimos elementos que entraram
    const entregasDia = container.querySelector(
      `.${estilo.informsEntregasDiaDisplay}`
    );
    if (entregasDia) {
      entregasDia.classList.remove(estilo.informsEntregasDiaDisplayAtivo);
    }

    const timeouts: NodeJS.Timeout[] = [];

    timeouts.push(
      setTimeout(() => {
        if (!container) return;
        const formulario = container.querySelector(
          `.${estilo.informsFormularioDisplay}`
        );
        formulario?.classList.remove(estilo.informsFormularioDisplayAtivo);
      }, 200)
    );

    timeouts.push(
      setTimeout(() => {
        if (!container) return;
        const tabela = container.querySelector(
          `.${estilo.informsTabelaDisplay}`
        );
        tabela?.classList.remove(estilo.informsTabelaDisplayAtivo);
      }, 400)
    );

    timeouts.push(
      setTimeout(() => {
        if (!container) return;
        const graficos = container.querySelector(
          `.${estilo.informsGraficoDisplay}`
        );
        graficos?.classList.remove(estilo.informsGraficoDisplayAtivo);
      }, 600)
    );

    timeouts.push(
      setTimeout(() => {
        if (!container) return;
        const titulo = container.querySelector(`.${estilo.tituloDisplay}`);
        titulo?.classList.remove(estilo.tituloDisplayAtivo);
      }, 800)
    );

    timeouts.push(
      setTimeout(() => {
        if (!container) {
          timeouts.forEach(clearTimeout);
          return;
        }
        container.classList.remove(estilo.containerMarromAtivo);
        callback();
      }, 1000)
    );
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        animarElementos();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    usuarioLogado?.userName === "Administradores" && (
      <div
        className={`${estilo.telaFullRelatorioEntregas} ${
          !isVisible ? estilo.telaFullRelatorioEntregasFora : ""
        }`}
        id="telaFullRelatorioId"
        onClick={(ev) => {
          if (ev.target === ev.currentTarget) {
            desanimarElementos(() => {
              setIsVisible(false);
            });
          }
        }}
      >
        <div
          className={`${estilo.containerMarrom} ${estilo.containerGridRelatorios}`}
          ref={containerRef}
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
        </div>
      </div>
    )
  );
}
