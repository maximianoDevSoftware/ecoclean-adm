"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import estilo from "@/styles/mapa.module.css";
import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { MarcadoresMapaonSide } from "./components/marcadoresOnMap";
import { entregasTipo } from "@/types/entregasTypes";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";
import { contextAutenticacao } from "@/contexts/contextoUsuario";

interface MapaInterface {
  mapaPronto: leaflet.Map | undefined;
  marcadores: {
    novoMarcador: leaflet.Marker;
    entregaMarcador: entregasTipo;
  }[];
  telaMapaMarcadores: leaflet.LayerGroup<any> | undefined;
  adicionandoMarcadores: ({
    novoMarcador,
    entregaMarcador,
  }: {
    novoMarcador: leaflet.Marker;
    entregaMarcador: entregasTipo;
  }) => void;
}

export const contextMapa = createContext<MapaInterface>({} as any);

/********************** Váriaveis para serem usadas na execução do mapa pelo código. */
const coordsMatinhos = [-25.8175, -48.5428] as leaflet.LatLngExpression;
const urlTile = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const attributionTx =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

var controlMapVar = true;

export default function Mapa({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const mapaElemento = useRef(null);
  const [mapaPronto, setMapaPronto] = useState<leaflet.Map>();
  const [telaMapaMarcadores, setTelaMapaMarcadores] =
    useState<leaflet.LayerGroup>();
  const [marcadores, setMarcadores] = useState<
    { novoMarcador: leaflet.Marker; entregaMarcador: entregasTipo }[]
  >([]);

  const { entregasDia, entregasAndamento, atualizandoClientes } = useContext(
    ContextEntregasClientes
  );
  const { usuarioLogado } = useContext(contextAutenticacao);

  const adicionandoMarcadores = ({
    novoMarcador,
    entregaMarcador,
  }: {
    novoMarcador: leaflet.Marker;
    entregaMarcador: entregasTipo;
  }) => {
    setMarcadores((marcadoresAnteriores) => {
      if (marcadoresAnteriores) {
        return [...marcadoresAnteriores, { novoMarcador, entregaMarcador }];
      } else {
        return [{ novoMarcador, entregaMarcador }];
      }
    });
  };

  const gerandoMapa = () => {
    if (typeof window === "undefined") return;
    if (!mapaElemento.current) return;
    if (controlMapVar) {
      controlMapVar = false;

      const mapaGerado = leaflet
        .map(mapaElemento.current)
        .setView(coordsMatinhos, 13);

      leaflet
        .tileLayer(urlTile, {
          maxZoom: 19,
          attribution: attributionTx,
        })
        .addTo(mapaGerado);

      const layerMarcadores = leaflet.layerGroup().addTo(mapaGerado);
      setTelaMapaMarcadores(layerMarcadores);
      setMapaPronto(mapaGerado);
      atualizandoClientes();
      return mapaGerado;
    }
  };
  /**************************************** useEffect para definir quem são os marcadores das entregas disponíveis */
  useEffect(() => {
    gerandoMapa();
  }, [entregasDia, usuarioLogado]);

  /**************************************** useEffect para definir quem são os marcadores das entregas em andamento */

  /**************************************** useEffect para definir quem são os marcadores dos motoristas
   *
   *
   */

  return (
    <contextMapa.Provider
      value={{
        mapaPronto,
        marcadores,
        adicionandoMarcadores,
        telaMapaMarcadores,
      }}
    >
      {usuarioLogado?.userName === "Administradores" && (
        <div ref={mapaElemento} className={estilo.mapaElemento} id="meuMapaId">
          <MarcadoresMapaonSide></MarcadoresMapaonSide>
        </div>
      )}
      {children}
    </contextMapa.Provider>
  );
}
