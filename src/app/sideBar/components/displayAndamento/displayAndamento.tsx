"use client";

import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import { contextMapa } from "@/app/mapa/meuMapa";
import estilo from "@/styles/sideBar.module.css";
import { useContext } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineMessage } from "react-icons/md";
import { RiUserLocationFill } from "react-icons/ri";

export default function DisplayAndamento() {
  const { entregasAndamento } = useContext(ContextEntregasClientes);
  const { mapaPronto } = useContext(contextMapa);

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
        Entregas Andamento:
        <span className={estilo.quantidadeTitulo}>
          {entregasAndamento ? entregasAndamento.length : "0"}
        </span>
      </h1>

      <div className={estilo.areaInformsDisp}>
        {entregasAndamento?.map((entrega) => {
          return (
            <div
              className={`${estilo.caixaEntrega} `} /**${estilo.caixaAberta} */
              key={entrega.nome + entrega.id}
            >
              <div
                className={estilo.tituloCaixa}
                onClick={(ev) => {
                  console.log("Peguei o click no titulo da entrega");
                  let boxInfoEntrega = ev.currentTarget.parentElement;
                  boxInfoEntrega?.classList.toggle(estilo.caixaAberta);
                }}
              >
                <h3>{entrega.nome}</h3>
              </div>

              <div className={estilo.informCaixa}>
                <p>Bairro: {entrega.bairro}</p>
                <p>Rua: {entrega.rua}</p>
                <p>Número: {entrega.numero}</p>
                <p>Valor: R$ {entrega.valor}</p>
                <p>Entregador: {entrega.entregador}</p>
                <p>Volume: {entrega.volume}</p>
                <p>Pagamento: {entrega.pagamento}</p>
              </div>

              <div
                className={`${estilo.botoesCaixa} ${estilo.botoesCaixaDisp}`}
              >
                {/**Interação para localizar o endereço do motorista da entrega */}
                <button
                  className={estilo.iterLocationMorist}
                  onClick={(ev) => {
                    let esteBTN = ev.currentTarget;
                    console.log(esteBTN);
                  }}
                >
                  <RiUserLocationFill className="size-8" />
                </button>
                {/* Iteração para localizar o endereço do cliente da entrega*/}
                <button
                  className={estilo.iterLocationEntrega}
                  onClick={(ev) => {
                    let esteBTN = ev.currentTarget;
                    console.log(esteBTN);
                    mapaPronto?.flyTo(
                      [
                        entrega.coordenadas.latitude,
                        entrega.coordenadas.longitude,
                      ],
                      16,
                      {
                        duration: 2,
                      }
                    );
                  }}
                >
                  <FaMapLocationDot className="size-8" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
