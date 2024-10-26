"use client";
import estilo from "@/styles/sideBar.module.css";
import { entregasTipo } from "@/types/entregasTypes";
import { MdOutlineMessage } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { CgExtensionRemove } from "react-icons/cg";
import { useContext, useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import getSocket from "@/socket/socketCliente";
import { contextMapa } from "@/app/mapa/meuMapa";

let controladorInicialEntregas = true;
const socket = getSocket();

export default function EntregaSingular() {
  // const { mapaPronto, marcadores } = useContext(contextMapa);
  const { entregasDia, atualizandoEntregas } = useContext(
    ContextEntregasClientes
  );

  const { mapaPronto } = useContext(contextMapa);

  const [dadosUpdate, setDadosUpdate] = useState<entregasTipo>();
  const [dadosFormUpdate, setDadosFormUpdate] = useState({
    nome: "",
    telefone: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    valor: "",
    pagamento: "",
    entregador: "",
    volume: "",
  });

  const removendoEntrega = (entrega: entregasTipo) => {
    socket.emit("Deletar Entrega", entrega);
  };

  useEffect(() => {
    if (controladorInicialEntregas) {
      controladorInicialEntregas = false;
      atualizandoEntregas();
    }

    if (entregasDia) {
      console.log(
        "Ouvindo modificações nos clientes, atualizado: ",
        entregasDia.length + " clientes."
      );
    }
  }, [entregasDia]);

  return entregasDia?.map((entrega) => {
    const modificandoInputs = (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setDadosFormUpdate({
        ...dadosFormUpdate,
        [event.target.name]: event.target.value,
      });
    };
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
            setDadosUpdate(entrega);
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

        <div className={estilo.botoesCaixa}>
          {/**Interação de enviar mensagem para o cliente */}
          <button
            className={estilo.interMensagens}
            onClick={(ev) => {
              let esteBTN = ev.currentTarget;

              esteBTN.classList.add(estilo.executandoMensagem);
              enviarMinhaMsgDisplay(entrega).then(() => {
                console.log("ouvindo quando enviad");
                esteBTN.classList.remove(estilo.executandoMensagem);
                esteBTN.classList.add(estilo.mensagemEnviada);
              });
            }}
          >
            <MdOutlineMessage className="size-8" />
          </button>
          {/* Botão para centralizar no mapa o marcador da entrega */}
          <button
            className={estilo.editLocationBTN}
            onClick={() => {
              mapaPronto?.flyTo(
                [entrega.coordenadas.latitude, entrega.coordenadas.longitude],
                17,
                {
                  duration: 3,
                }
              );
            }}
          >
            <FaSearchLocation className="size-8" />
          </button>
          {/**Botão de interação para editar a entrega */}
          <button
            className={estilo.interEdit}
            onClick={(ev) => {
              let cxEntrega = ev.currentTarget.parentElement?.parentElement;
              let cxEditando =
                ev.currentTarget.parentElement?.parentElement?.lastElementChild;
              cxEntrega?.classList.toggle(estilo.caixaEditando);
              cxEditando?.classList.toggle(estilo.areaBotoesEditFora);
              setDadosFormUpdate({
                nome: entrega.nome,
                cidade: entrega.cidade,
                bairro: entrega.bairro,
                rua: entrega.rua,
                numero: entrega.numero,
                valor: entrega.valor,
                pagamento: entrega.pagamento,
                entregador: entrega.entregador,
                volume: entrega.volume,
                telefone: entrega.telefone ? entrega.telefone : "",
              });
            }}
          >
            <MdEditSquare className="size-8" />
          </button>
          {/**Interação de remover a entrega das entregas do dia*/}
          <button
            className={estilo.interRemove}
            onClick={() => {
              removendoEntrega(entrega);
            }}
          >
            <CgExtensionRemove className="size-8" />
          </button>
        </div>

        <div
          className={` ${estilo.caixaEditEntrega} ${estilo.areaBotoesEditFora}`}
          id={entrega.id}
        >
          <h3>
            Nome:{" "}
            <input
              defaultValue={entrega.nome}
              name="nome"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Telefone:{" "}
            <input
              defaultValue={entrega.telefone}
              name="telefone"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Cidade:{" "}
            <input
              defaultValue={entrega.cidade}
              name="cidade"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Bairro:{" "}
            <input
              defaultValue={entrega.bairro}
              name="bairro"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Rua:{" "}
            <input
              defaultValue={entrega.rua}
              name="rua"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Número:{" "}
            <input
              defaultValue={entrega.numero}
              name="numero"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Valor:{" "}
            <input
              defaultValue={entrega.valor}
              name="valor"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Pagamento:{" "}
            <input
              defaultValue={entrega.pagamento}
              name="pagamento"
              onChange={modificandoInputs}
            />
          </h3>

          <h3>
            Motorista:{" "}
            <input
              defaultValue={entrega.entregador}
              name="entregador"
              onChange={modificandoInputs}
            />
          </h3>

          <div className={`${estilo.areaBotoesEditEntrega}`}>
            <button
              onClick={(ev) => {
                ev.currentTarget.parentElement?.parentElement?.classList.toggle(
                  estilo.areaBotoesEditFora
                );
                let cxEntrega =
                  ev.currentTarget.parentElement?.parentElement?.parentElement;
                cxEntrega?.classList.toggle(estilo.caixaEditando);
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                console.log(dadosFormUpdate);
                if (entrega.id) {
                  let telaUpdateEntrega = document.getElementById(entrega.id);
                  let novosDadosDefinidos: entregasTipo = {
                    id: entrega.id,
                    nome: (
                      telaUpdateEntrega?.children[0]
                        .children[0] as HTMLInputElement
                    ).value,
                    telefone: (
                      telaUpdateEntrega?.children[1]
                        .children[0] as HTMLInputElement
                    ).value,
                    cidade: (
                      telaUpdateEntrega?.children[2]
                        .children[0] as HTMLInputElement
                    ).value,
                    bairro: (
                      telaUpdateEntrega?.children[3]
                        .children[0] as HTMLInputElement
                    ).value,
                    rua: (
                      telaUpdateEntrega?.children[4]
                        .children[0] as HTMLInputElement
                    ).value,
                    numero: (
                      telaUpdateEntrega?.children[5]
                        .children[0] as HTMLInputElement
                    ).value,
                    valor: (
                      telaUpdateEntrega?.children[6]
                        .children[0] as HTMLInputElement
                    ).value,
                    pagamento: (
                      telaUpdateEntrega?.children[7]
                        .children[0] as HTMLInputElement
                    ).value,
                    entregador: (
                      telaUpdateEntrega?.children[8]
                        .children[0] as HTMLInputElement
                    ).value,
                    volume: (
                      telaUpdateEntrega?.children[9]
                        .children[0] as HTMLInputElement
                    ).value,
                    dia: entrega.dia,
                    coordenadas: entrega.coordenadas,
                  };
                  console.log(novosDadosDefinidos);
                  socket.emit("Atualizar Entrega", novosDadosDefinidos);
                }
              }}
            >
              Atualizar Entrega
            </button>
          </div>
        </div>
      </div>
    );
  });
}

const enviarMinhaMsgDisplay = async (entrega: entregasTipo) => {
  console.log("Iniciando Mensagem Display");
  let meuDadoMsg = {
    numero: "aaaa",
    mensagem: `
Ola, temos uma entrega indo até você.
A entrega está no nome de:
*${entrega?.nome}*

O valor total do seu pedido é de:
R$ ${entrega?.valor}

Não se esqueça de receber nosso entregador, ele está ansioso em ver você com todos os seus novos produtinhos ${String.fromCodePoint(
      0x1f60a
    )}

Equipe Eco Clean agradece sua preferência! 
    `,
  };
  console.log(meuDadoMsg);

  socket.emit("enviarMensagem", meuDadoMsg);

  return meuDadoMsg;
};
