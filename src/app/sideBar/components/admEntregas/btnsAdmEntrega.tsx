"use client";

import estilo from "@/styles/sideBar.module.css";
import estiloFade from "@/styles/fades/fadesSty.module.css";
import estiloFullCliente from "@/styles/telasFull.module.css";
import estiloRelatorio from "../../../Relatorio Entregas/telaRel.module.css";
import { useContext } from "react";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import { RelatorioContext } from "@/contexts/relatorioContext";

export default function BotoesAdministrarEntregas() {
  const { atualizandoClientes, atualizandoEntregasRelatorio } = useContext(
    ContextEntregasClientes
  );
  const { setIsVisible } = useContext(RelatorioContext);

  const abrindoTelaClientes = () => {
    let telaFundorForm = document.querySelector("#telaClientesForm");
    console.log(telaFundorForm);
    let infsClientEl = telaFundorForm?.children[0].children[1].children[0];
    let entregaClientEl = telaFundorForm?.children[0].children[1].children[1];
    let buttonClientEl = telaFundorForm?.children[0].children[1].children[2];
    let sideBar = telaFundorForm?.children[0].children[2];
    if (
      telaFundorForm &&
      infsClientEl &&
      entregaClientEl &&
      buttonClientEl &&
      sideBar
    ) {
      telaFundorForm.classList.toggle(estiloFullCliente.retiraNaEsquerda);
      setTimeout(() => {
        // formCliente.classList.toggle(estiloFullCliente.esfumacandoCima);
        infsClientEl.classList.toggle(estiloFade.saiEsquerda);
        entregaClientEl.classList.toggle(estiloFade.saiDireita);
        buttonClientEl.classList.toggle(estiloFade.saiBaixo);
        sideBar.classList.toggle(estiloFade.saiBaixo);
      }, 500);
    }
    atualizandoClientes();
  };

  const abrindoTelaNovoCliente = () => {
    let telaFundorForm = document.querySelector("#telaNovoClientesForm");
    if (telaFundorForm) {
      let infsCliente = telaFundorForm.children[0].children[0].children[0];
      let infsEntrega = telaFundorForm.children[0].children[0].children[1];
      let sideBar = telaFundorForm.children[0].children[1];
      telaFundorForm.classList.toggle(estiloFullCliente.retiraNaEsquerda);
      setTimeout(() => {
        infsCliente.classList.toggle(estiloFade.saiEsquerda);
        infsEntrega.classList.toggle(estiloFade.saiCima);
        sideBar.classList.toggle(estiloFade.saiBaixo);
      }, 300);
    }
  };

  const abrirTelaRelatorio = () => {
    atualizandoEntregasRelatorio();
    setIsVisible(true);
  };

  return (
    <div className={estilo.admBtnEntregas}>
      <div
        className={estilo.gerarEntregasBTN}
        onClick={(ev) => {
          console.log(ev.currentTarget);
          ev.currentTarget.classList.toggle(estilo.abrirBotaoInicial);
        }}
      >
        <h1 className={estilo.tituloGerarEntregas}>GERAR ROTAS DE ENTREGAS</h1>

        <button onClick={abrindoTelaClientes}>Meus Clientes</button>
        <button onClick={abrindoTelaNovoCliente}>Novos Clientes</button>
      </div>

      <div className={estilo.gerarEntregasBTN}>
        <h1 className={estilo.tituloGerarEntregas} onClick={abrirTelaRelatorio}>
          RELATÓRIO DE ENTREGAS
        </h1>
      </div>
    </div>
  );
}
