import leaflet from "leaflet";

import estilo from "@/styles/marcadores/entregaMarker.module.css";
import { entregasTipo } from "@/types/entregasTypes";

export const markerEntrega = (entrega: entregasTipo) => {
  if (entrega.status === "Disponível") {
    let motoristaDessaEntrega = meuEntregador(entrega);
    console.log(" Entrega no marcador: ", entrega.nome);
    const entregasIconLeaf = leaflet.divIcon({
      html: `<div class=${estilo.areaMark}>
                    <div class=${estilo.areaStatsEntrega}>
                      <div class=${estilo.iconeEntregaMapa}>
                        <div class=${estilo.fotoEntregadorIcone}>
                          ${motoristaDessaEntrega}
                          <div class=${estilo.nomeEntregaIcone}>
                            <h3>Entrega para: ${entrega.nome}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class=${estilo.entregaMarcador}></div>
                 </div>
                 `,
      className: `bg-black bg-opacity-0 border-r-10`,
    });
    return entregasIconLeaf;
  } else {
    let motoristaDessaEntrega = meuEntregador(entrega);

    const entregasIconLeaf = leaflet.divIcon({
      html: `<div class=${estilo.areaMark}>
                  <div class=${estilo.marcadorAndamento}>
                    <div class=${estilo.iconeEntregaMapa}>
                      <div class=${estilo.fotoEntregadorIcone}>
                        ${motoristaDessaEntrega}
                        <div class=${estilo.nomeEntregaIcone}>
                          <h3>Entregando para: ${entrega.nome}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=${estilo.entregaMarcador}></div>
               </div>
               `,
      className: `bg-black bg-opacity-0 border-r-10`,
    });
    return entregasIconLeaf;
  }
};

export const markerTeste = () => {
  const entregasIconLeaf = leaflet.divIcon({
    html: `<div class=${estilo.areaMark}>
                  <div class=${estilo.areaStatsEntrega}>
                    <div class=${estilo.iconeEntregaMapa}>
                      <div class=${estilo.fotoEntregadorIcone}>
                        <div class=${estilo.nomeEntregaIcone}>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=${estilo.entregaMarcador}></div>
               </div>
               `,
    className: `bg-black bg-opacity-0 border-r-10`,
  });
  return entregasIconLeaf;
};

const meuEntregador = (entrega: entregasTipo) => {
  if (entrega.entregador == "Marcos") {
    return `<div class=${estilo.marcosIconeEntrega}></div>`;
  } else if (entrega.entregador == "Uene") {
    return `<div class=${estilo.ueneIconeEntrega}></div>`;
  } else if (entrega.entregador == "Leo") {
    return `<div class=${estilo.leoIconeEntrega}></div>`;
  } else if (entrega.entregador == "João") {
    return `<div class=${estilo.joaoIconeEntrega}></div>`;
  }
};

export const markerEntregaAndamento = (entrega: entregasTipo) => {
  let motoristaDessaEntrega = meuEntregador(entrega);

  const entregasIconLeaf = leaflet.divIcon({
    html: `<div class=${estilo.areaMark}>
                  <div class=${estilo.marcadorAndamento}>
                    <div class=${estilo.iconeEntregaMapa}>
                      <div class=${estilo.fotoEntregadorIcone}>
                        ${motoristaDessaEntrega}
                        <div class=${estilo.nomeEntregaIcone}>
                          <h3>Entrega para: ${entrega.nome}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class=${estilo.entregaMarcador}></div>
               </div>
               `,
    className: `bg-black bg-opacity-0 border-r-10`,
  });
  return entregasIconLeaf;
};

export const marcadorMotoristas = (nome: string) => {
  const meuEntregadorInterno = (nomeEntregador: string) => {
    if (nomeEntregador == "Marcos") {
      return `<div class=${estilo.marcosIconeEntrega}></div>`;
    } else if (nomeEntregador == "Uene") {
      return `<div class=${estilo.ueneIconeEntrega}></div>`;
    } else if (nomeEntregador == "Leo") {
      return `<div class=${estilo.leoIconeEntrega}></div>`;
    } else if (nomeEntregador == "João") {
      return `<div class=${estilo.joaoIconeEntrega}></div>`;
    }
  };

  const entregasIconLeaf = leaflet.divIcon({
    html: `<div class=${estilo.areaMark}>
                  <div class=${estilo.areaEntregadoRota}>
                    ${meuEntregadorInterno(nome)}
                  </div>
                  <div class=${estilo.entregaMarcador}></div>
               </div>
               `,
    className: `bg-black bg-opacity-0 border-r-10`,
  });
  return entregasIconLeaf;
};
