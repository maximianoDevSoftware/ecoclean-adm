"use client";

import { useContext, useState } from "react";
import estilo from "../telaRel.module.css";
import { entregasTipo } from "@/types/entregasTypes";
import { contextAutenticacao } from "@/contexts/contextoUsuario";

export function MotoristasRelatorio() {
  const { usuarioLogado, marcosUser, ueneUser, leoUser, joaoUser } =
    useContext(contextAutenticacao);

  const [entregasRelatorio, setEntregasRelatorio] = useState<entregasTipo[]>();

  const buscandoEntregasRelatorio = () => {
    /**Aqui dentro eu desenvolvo o metodo que vai buscar as entregas necessárias para redigir um relatório */
  };

  const calculoRelatorioMotorista = () => {
    let entregasMarcos: entregasTipo[];
    let entregasUene: entregasTipo[];
    let entregasLeo: entregasTipo[];
    let entregasJoao: entregasTipo[];

    entregasRelatorio?.map((entregaUnica) => {
      if (entregaUnica.entregador === "Marcos") {
        entregasMarcos.push(entregaUnica);
      } else if (entregaUnica.entregador === "Uene") {
        entregasUene.push(entregaUnica);
      } else if (entregaUnica.entregador === "Leo") {
        entregasLeo.push(entregaUnica);
      } else if (entregaUnica.entregador === "João") {
        entregasJoao.push(entregaUnica);
      }
    });
  };

  return (
    <div className={estilo.telaInfosMotoristaRel}>
      <h1 className={estilo.tituloRelatorioMotoristas}>
        Entregas por Motoristas
      </h1>
    </div>
  );
}
