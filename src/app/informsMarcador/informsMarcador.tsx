"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { contextMapa } from "../mapa/meuMapa";
import estiloInform from "@/styles/telaInfMarcador/telaInfMarker.module.css";
import { entregasTipo } from "@/types/entregasTypes";
import leaflet from "leaflet";
import { RiUserLocationFill } from "react-icons/ri";
import { BiMessageCheck } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import getSocket from "@/socket/socketCliente";

const socket = getSocket();

export default function TelaMarcadorInform() {
  const { mapaPronto, marcadores } = useContext(contextMapa);
  const { entregasDia, atualizandoEntregas } = useContext(
    ContextEntregasClientes
  );
  const { usuarioLogado } = useContext(contextAutenticacao);
  const telaInformMR = useRef<HTMLDivElement>(null);
  const [entregaEvidencia, setEntregaEvidencia] = useState<entregasTipo>();
  const [marcadorEvidencia, setMarcadorEvidencia] = useState<leaflet.Marker>();
  const [mensagemEnviada, setMensagemEnviada] = useState(false);

  marcadores?.map((minhaMark, indexMark) => {
    minhaMark.novoMarcador.addEventListener("click", () => {
      adicionandoTelaInform();
      if (entregasDia) {
        setEntregaEvidencia(minhaMark.entregaMarcador);
        setMarcadorEvidencia(minhaMark.novoMarcador);
        setMensagemEnviada(false);
      }
    });
  });

  let elementoMapa = document.querySelector("#meuMapaId");

  const enviarMinhaMSG = () => {
    if (mensagemEnviada) return;
    if (!entregaEvidencia?.telefone) return;

    // Verifica se a string contém números
    const contemNumeros = /\d/.test(entregaEvidencia.telefone);

    if (!contemNumeros) return;

    // Remove todos os caracteres não numéricos
    const apenasNumeros = entregaEvidencia.telefone.replace(/\D/g, "");

    // Adiciona "55" no início se não começar com "55"
    const numeroFormatado = apenasNumeros.startsWith("55")
      ? apenasNumeros
      : `55${apenasNumeros}`;

    const meuDadoMsg = {
      contato: numeroFormatado,
      mensagem: `
Ola, ${entregaEvidencia.entregador}.
Você tem uma entrega para:
*${entregaEvidencia.nome}*

Bairro: ${entregaEvidencia.bairro}

Rua: ${entregaEvidencia.rua}

Número: ${entregaEvidencia.numero}
    `,
    };

    socket.emit("enviarMensagem", meuDadoMsg);
    setMensagemEnviada(true);
  };

  const removendoTelaInform = () => {
    if (telaInformMR.current) {
      telaInformMR.current.classList.add(estiloInform.telaInformMarcadorFora);
    }
  };

  const adicionandoTelaInform = () => {
    if (telaInformMR.current) {
      telaInformMR.current.classList.remove(
        estiloInform.telaInformMarcadorFora
      );
    }
  };

  elementoMapa?.addEventListener("click", (ev) => {
    if (ev.target === ev.currentTarget) {
      removendoTelaInform();
    }
  });

  const liberandoPontoMarcador = (btnClick: HTMLButtonElement) => {
    let elementoMarcadorFoto =
      marcadorEvidencia?.getElement()?.children[0].children[1];

    let elementoMarcadorTexto =
      marcadorEvidencia?.getElement()?.children[0].children[0];

    if (marcadorEvidencia?.dragging?.enabled()) {
      marcadorEvidencia.dragging.disable();

      const novaCoord = marcadorEvidencia.getLatLng();

      btnClick.classList.toggle(estiloInform.btnLocationAtivo);

      elementoMarcadorFoto?.classList.toggle(estiloInform.marcadorEstaAtivo);

      if (entregaEvidencia) {
        if (entregaEvidencia.id) {
          const updateEntregaCoords: entregasTipo = {
            id: entregaEvidencia.id,
            nome: entregaEvidencia.nome,
            telefone: entregaEvidencia.telefone,
            status: entregaEvidencia.status,
            cidade: entregaEvidencia.cidade,
            bairro: entregaEvidencia.bairro,
            rua: entregaEvidencia.rua,
            numero: entregaEvidencia.numero,
            coordenadas: {
              latitude: novaCoord.lat,
              longitude: novaCoord.lng,
            },
            dia: entregaEvidencia.dia,
            entregador: entregaEvidencia.entregador,
            pagamento: entregaEvidencia.pagamento,
            valor: entregaEvidencia.valor,
            volume: entregaEvidencia.volume,
          };

          socket.emit("Atualizar Entrega", updateEntregaCoords);
        }
      }

      elementoMarcadorTexto?.classList.toggle(
        estiloInform.nomeComMarcadorAtivo
      );
    } else {
      marcadorEvidencia?.dragging?.enable();

      btnClick.classList.toggle(estiloInform.btnLocationAtivo);

      elementoMarcadorFoto?.classList.toggle(estiloInform.marcadorEstaAtivo);

      elementoMarcadorTexto?.classList.toggle(
        estiloInform.nomeComMarcadorAtivo
      );
    }
  };

  useEffect(() => {}, [usuarioLogado]);

  return (
    <>
      <div
        className={`${estiloInform.telaInformMarcador} ${estiloInform.telaInformMarcadorFora}`}
        ref={telaInformMR}
      >
        <div className={estiloInform.areaBTNSinfMR}>
          <button
            onClick={(ev) => {
              liberandoPontoMarcador(ev.currentTarget);
            }}
          >
            <RiUserLocationFill />
          </button>

          <button
            onClick={() => {
              enviarMinhaMSG();
            }}
            className={`${
              mensagemEnviada ? estiloInform.btnMensagemEnviada : ""
            }`}
            disabled={mensagemEnviada}
          >
            <BiMessageCheck />
          </button>

          <button
            onClick={() => {
              if (entregaEvidencia) {
                mapaPronto?.flyTo(
                  [
                    entregaEvidencia?.coordenadas.latitude,
                    entregaEvidencia?.coordenadas.longitude,
                  ],
                  17,
                  {
                    animate: true,
                    duration: 1,
                  }
                );
              }
            }}
          >
            <FaMapLocationDot />
          </button>
        </div>

        <div className={estiloInform.areaInformacoesMR}>
          <h3>Entrega para: {entregaEvidencia?.nome}</h3>
          <h3>Contato: {entregaEvidencia?.telefone}</h3>
          <h3>Bairro: {entregaEvidencia?.bairro}</h3>
          <h3>Rua: {entregaEvidencia?.rua}</h3>
          <h3>Número: {entregaEvidencia?.numero}</h3>
          <h3>Valor: {entregaEvidencia?.valor}</h3>
          <h3>Pagamento: {entregaEvidencia?.pagamento}</h3>
          <h3>Entregador: {entregaEvidencia?.entregador}</h3>
          {entregaEvidencia?.observacoes && (
            <h3>Observações: {entregaEvidencia.observacoes}</h3>
          )}
        </div>
      </div>
    </>
  );
}
