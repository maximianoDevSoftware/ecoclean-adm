"use client";

import estilo from "@/styles/sideBar.module.css";
import { useContext } from "react";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import dynamic from "next/dynamic";

const EntregaSingular = dynamic(() => import("./components/cadaEntrega"), {
  ssr: false,
});

export default function DisplayEntregas() {
  const { entregasDia } = useContext(ContextEntregasClientes);
  return (
    <div className={estilo.displayEntregas}>
      <h1
        className={estilo.titulosDisplay}
        onClick={(ev) => {
          ev.currentTarget.parentElement?.classList.toggle(
            estilo.displayEntregasAberto
          );
        }}
      >
        Entregas Disponíveis:
        <span className={estilo.quantidadeTitulo}>
          {entregasDia ? entregasDia.length : "0"}
        </span>
      </h1>

      <div className={estilo.areaInformsDisp}>
        <EntregaSingular></EntregaSingular>
      </div>
    </div>
  );
}
