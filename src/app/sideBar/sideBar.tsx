"use client";

import estilo from "@/styles/sideBar.module.css";
import DisplayEntregas from "./components/displayEntregas/displayEntregas";

import BotoesAdministrarEntregas from "./components/admEntregas/btnsAdmEntrega";
import { useContext } from "react";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import dynamic from "next/dynamic";

const DisplayAndamento = dynamic(
  () => import("./components/displayAndamento/displayAndamento"),
  { ssr: false }
);

export function SideBar() {
  const { usuarioLogado } = useContext(contextAutenticacao);

  return (
    <>
      {usuarioLogado?.userName === "Administradores" && (
        <div className={estilo.sideBarArea + " roalgemPers"} id="sideBarId">
          <>
            <DisplayEntregas />
            <DisplayAndamento />

            <BotoesAdministrarEntregas />
          </>
        </div>
      )}
    </>
  );
}
