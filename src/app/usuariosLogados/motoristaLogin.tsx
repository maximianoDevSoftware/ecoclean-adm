"use client";

import { useContext, useEffect, useRef, useState } from "react";
import estilo from "@/styles/loginStatusBar/loginMotoristas.module.css";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdOutlineWifiCalling3 } from "react-icons/md";
import { entregasTipo } from "@/types/entregasTypes";
import { contextMapa } from "../mapa/meuMapa";
import { usuarioTipo } from "@/types/userTypes";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import getSocket from "@/socket/socketCliente";

const socket = getSocket();

export default function MotoristasLogin() {
  const { usuarioLogado, marcosUser, ueneUser, leoUser, joaoUser } =
    useContext(contextAutenticacao);
  const {
    rotaEntregasMarcos,
    rotaEntregasUene,
    rotaEntregasLeo,
    rotaEntregasJoao,
  } = useContext(ContextEntregasClientes);
  const marcosEl = useRef<HTMLDivElement>(null);
  const ueneEl = useRef<HTMLDivElement>(null);
  const leoEl = useRef<HTMLDivElement>(null);
  const joaoEl = useRef<HTMLDivElement>(null);

  const { mapaPronto } = useContext(contextMapa);

  const verificandoMotoristas = () => {
    if (marcosUser.status == "Indisponível") {
      marcosEl.current?.classList.remove(estilo.userOn);
      marcosEl.current?.classList.add(estilo.userOff);
    } else if (marcosUser.status == "Disponível") {
      marcosEl.current?.classList.remove(estilo.userOff);
      marcosEl.current?.classList.add(estilo.userOn);
    }

    if (ueneUser.status == "Indisponível") {
      ueneEl.current?.classList.remove(estilo.userOn);
      ueneEl.current?.classList.add(estilo.userOff);
    } else if (ueneUser.status == "Disponível") {
      ueneEl.current?.classList.remove(estilo.userOff);
      ueneEl.current?.classList.add(estilo.userOn);
    }

    if (leoUser.status == "Indisponível") {
      leoEl.current?.classList.remove(estilo.userOn);
      leoEl.current?.classList.add(estilo.userOff);
    } else if (leoUser.status == "Disponível") {
      leoEl.current?.classList.remove(estilo.userOff);
      leoEl.current?.classList.add(estilo.userOn);
    }

    if (joaoUser.status == "Indisponível") {
      joaoEl.current?.classList.remove(estilo.userOn);
      joaoEl.current?.classList.add(estilo.userOff);
    } else if (leoUser.status == "Disponível") {
      joaoEl.current?.classList.remove(estilo.userOff);
      joaoEl.current?.classList.add(estilo.userOn);
    }
  };

  useEffect(() => {
    verificandoMotoristas();
  }, [marcosUser, ueneUser, leoUser, joaoUser, usuarioLogado]);

  const enviarMensagemRotaMotorista = (
    nomeMotorista: string,
    conjuntoEntregas: entregasTipo[]
  ) => {
    const contatosPorEntregador = {
      Marcos: "554188996458",
      Uene: "554188996458",
      Leo: "554188996458",
      João: "554188996458",
    };

    const objetoMsg = {
      contato:
        contatosPorEntregador[
          nomeMotorista as keyof typeof contatosPorEntregador
        ],
      mensagem: `
Olá ${nomeMotorista}.
Temos uma rota de entrega pronta, disponível para você:
${conjuntoEntregas?.map((cadaEntrega, index) => {
  return `
*${index + 1}ª entrega.*
${cadaEntrega.nome}
`;
})}`,
    };

    console.log(objetoMsg);
    socket.emit("Enviar Mensagem", objetoMsg);
  };

  const buscarLocalizacao = (usuario: usuarioTipo) => {
    if (mapaPronto) {
      mapaPronto?.flyTo(
        [usuario.localizacao.latitude, usuario.localizacao.longitude],

        17,
        {
          duration: 3,
        }
      );
    } else return;
  };

  return (
    <>
      {usuarioLogado?.userName === "Administradores" && (
        <div className={`${estilo.areaLoginStatus}`} id="telaMotoristas">
          <div
            className={`${estilo.telaLoginStatus} ${estilo.userOff}`}
            ref={marcosEl}
          >
            <div
              className={`${estilo.fotosUser} ${estilo.marcosFoto} mb-10`}
            ></div>
            <div className={estilo.areaInformsUser}>
              <h3>{marcosUser.userName}</h3>
              <h3 className={estilo.textUserStatus}>{marcosUser.status}</h3>
            </div>

            {marcosUser.status === "Disponível" && (
              <div
                className={`flex items-center justify-around   w-full absolute bottom-2 `}
              >
                <button
                  className={`${estilo.btnEnviarMensagemMotoraLogin}`}
                  onClick={(ev) => {
                    console.log("Olá Marcos, temos uma rota de entrega pronta");
                    // console.log(rotaEntregasMarcos);
                    if (rotaEntregasMarcos)
                      enviarMensagemRotaMotorista("Marcos", rotaEntregasMarcos);
                  }}
                >
                  <BiMessageSquareDetail className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#3ebe5a]" />
                </button>

                <button
                  className={`${estilo.btnViajarLocalMotorista}`}
                  onClick={() => {
                    buscarLocalizacao(marcosUser);
                  }}
                >
                  <FaLocationCrosshairs className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#32658f]" />
                </button>

                <button
                  className={`${estilo.btnLicacaoMotorista}`}
                  onClick={() => {
                    window.location.href = "tel:+551992757516";
                  }}
                >
                  <MdOutlineWifiCalling3 className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#583794]" />
                </button>
              </div>
            )}
          </div>

          <div
            className={`${estilo.telaLoginStatus} ${estilo.userOff}`}
            ref={ueneEl}
          >
            <div
              className={`${estilo.fotosUser} ${estilo.ueneFoto} mb-10`}
            ></div>
            <div className={estilo.areaInformsUser}>
              <h3>{ueneUser.userName}</h3>
              <h3 className={estilo.textUserStatus}>{ueneUser.status}</h3>
            </div>

            {ueneUser.status === "Disponível" && (
              <div
                className={`flex items-center justify-around   w-full absolute bottom-2 `}
              >
                <button
                  className={`${estilo.btnEnviarMensagemMotoraLogin}`}
                  onClick={(ev) => {
                    console.log("Olá Uene, temos uma rota de entrega pronta");
                    // console.log(rotaEntregasUene);
                    if (rotaEntregasUene)
                      enviarMensagemRotaMotorista("Uene", rotaEntregasUene);
                  }}
                >
                  <BiMessageSquareDetail className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#3ebe5a]" />
                </button>

                <button
                  className={`${estilo.btnViajarLocalMotorista}`}
                  onClick={() => {
                    buscarLocalizacao(ueneUser);
                  }}
                >
                  <FaLocationCrosshairs className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#32658f]" />
                </button>

                <button
                  className={`${estilo.btnLicacaoMotorista}`}
                  onClick={() => {
                    window.location.href = "tel:+551992757516";
                  }}
                >
                  <MdOutlineWifiCalling3 className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#583794]" />
                </button>
              </div>
            )}
          </div>

          <div
            className={`${estilo.telaLoginStatus} ${estilo.userOff}`}
            ref={leoEl}
          >
            <div
              className={`${estilo.fotosUser} ${estilo.leoFoto} mb-10`}
            ></div>
            <div className={estilo.areaInformsUser}>
              <h3>{leoUser.userName}</h3>
              <h3 className={estilo.textUserStatus}>{leoUser.status}</h3>
            </div>

            {leoUser.status === "Disponível" && (
              <div
                className={`flex items-center justify-around   w-full absolute bottom-2 `}
              >
                <button
                  className={`${estilo.btnEnviarMensagemMotoraLogin}`}
                  onClick={(ev) => {
                    console.log("Olá Leo, temos uma rota de entrega pronta");
                    console.log(rotaEntregasLeo);
                    if (rotaEntregasLeo) {
                      enviarMensagemRotaMotorista("Leo", rotaEntregasLeo);
                    }
                  }}
                >
                  <BiMessageSquareDetail className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#3ebe5a]" />
                </button>

                <button
                  className={`${estilo.btnViajarLocalMotorista}`}
                  onClick={() => {
                    buscarLocalizacao(leoUser);
                  }}
                >
                  <FaLocationCrosshairs className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#32658f]" />
                </button>

                <button
                  className={`${estilo.btnLicacaoMotorista}`}
                  onClick={() => {
                    window.location.href = "tel:+551992757516";
                  }}
                >
                  <MdOutlineWifiCalling3 className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#583794]" />
                </button>
              </div>
            )}
          </div>

          <div
            className={`${estilo.telaLoginStatus} ${estilo.userOff}`}
            ref={joaoEl}
          >
            <div
              className={`${estilo.fotosUser} ${estilo.joaoFoto} mb-10`}
            ></div>
            <div className={estilo.areaInformsUser}>
              <h3>{joaoUser.userName}</h3>
              <h3 className={estilo.textUserStatus}>{joaoUser.status}</h3>
            </div>

            {(joaoUser.status === "Disponível" && (
              <div
                className={`flex items-center justify-around   w-full absolute bottom-2 `}
              >
                <button
                  className={`${estilo.btnEnviarMensagemMotoraLogin}`}
                  onClick={(ev) => {
                    console.log("Olá João, temos uma rota de entrega pronta");
                    // console.log(rotaEntregasJoao);
                    if (rotaEntregasJoao)
                      enviarMensagemRotaMotorista("João", rotaEntregasJoao);
                  }}
                >
                  <BiMessageSquareDetail className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#3ebe5a]" />
                </button>

                <button
                  className={`${estilo.btnViajarLocalMotorista}`}
                  onClick={() => {
                    buscarLocalizacao(joaoUser);
                  }}
                >
                  <FaLocationCrosshairs className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#32658f]" />
                </button>

                <button
                  className={`${estilo.btnLicacaoMotorista}`}
                  onClick={() => {
                    window.location.href = "tel:+551992757516";
                  }}
                >
                  <MdOutlineWifiCalling3 className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#583794]" />
                </button>
              </div>
            )) ||
              (joaoUser.status === "Indisponível" && (
                <div
                  className={`flex items-center justify-around   w-full absolute bottom-2 `}
                >
                  <button
                    className={`${estilo.btnEnviarMensagemMotoraLogin}`}
                    onClick={(ev) => {
                      console.log("Olá João, temos uma rota de entrega pronta");
                      // console.log(rotaEntregasJoao);
                      if (rotaEntregasJoao)
                        enviarMensagemRotaMotorista("João", rotaEntregasJoao);
                    }}
                  >
                    <BiMessageSquareDetail className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#3ebe5a]" />
                  </button>

                  <button
                    className={`${estilo.btnViajarLocalMotorista}`}
                    onClick={() => {
                      buscarLocalizacao(joaoUser);
                    }}
                  >
                    <FaLocationCrosshairs className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#32658f]" />
                  </button>

                  <button
                    className={`${estilo.btnLicacaoMotorista}`}
                    onClick={() => {
                      window.location.href = "tel:+551992757516";
                    }}
                  >
                    <MdOutlineWifiCalling3 className="size-8 text-gray-400 transform transition-all duration-300 hover:scale-110 hover:text-[#583794]" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
