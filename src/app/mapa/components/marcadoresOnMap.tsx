"use client";
import leaflet, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"; // Importando o estilo CSS do Leaflet Routing Machine
import { useContext, useEffect, useRef, useCallback } from "react";
import { contextMapa } from "../meuMapa";
import { entregasTipo } from "@/types/entregasTypes";
import "leaflet-routing-machine"; // Importando o Leaflet Routing Machine
import { usuarioTipo } from "@/types/userTypes";
import { marcadorMotoristas, markerEntrega } from "./iconesLocation";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";

export function MarcadoresMapaonSide() {
  const { mapaPronto, adicionandoMarcadores } = useContext(contextMapa);
  const { marcosUser, ueneUser, leoUser, joaoUser } =
    useContext(contextAutenticacao);
  const { entregasDia, entregasAndamento } = useContext(
    ContextEntregasClientes
  );

  // Defina o tipo do objeto de controle de rota
  type RotaControles = {
    [key: number]: any; // ou substitua 'any' pelo tipo específico se souber qual é
  };

  // Inicialize o ref com o tipo correto
  const rotaControles = useRef<RotaControles>({});

  function desenharRota(
    entregasOrdenadas: entregasTipo[],
    usuario: usuarioTipo,
    cor: string
  ) {
    const waypoints = [
      leaflet.latLng(
        usuario.localizacao.latitude,
        usuario.localizacao.longitude
      ),
    ];

    entregasOrdenadas.forEach((entrega) => {
      waypoints.push(
        leaflet.latLng(
          entrega.coordenadas.latitude,
          entrega.coordenadas.longitude
        )
      );
    });

    const plan = new leaflet.Routing.Plan(waypoints, {
      createMarker: (i, wp) => {
        const marcador = leaflet.marker(wp.latLng, {
          icon:
            i === 0
              ? marcadorMotoristas(usuario.userName)
              : markerEntrega(entregasOrdenadas[i - 1]),
        });

        if (i !== 0) {
          const dadosProntos = {
            novoMarcador: marcador,
            entregaMarcador: entregasOrdenadas[i - 1],
          };
          adicionandoMarcadores(dadosProntos);
        }

        return marcador;
      },
    });

    let valorUsuario: number = 0;

    if (usuario.userName === "Marcos") {
      valorUsuario = 0;
    } else if (usuario.userName === "Uene") {
      valorUsuario = 1;
    } else if (usuario.userName === "Leo") {
      valorUsuario = 2;
    } else if (usuario.userName === "João") {
      valorUsuario = 3;
    }

    if (mapaPronto) {
      // Remover a rota anterior, se existir

      if (rotaControles.current[valorUsuario]) {
        mapaPronto.removeControl(rotaControles.current[valorUsuario]);
      }

      // Adicionar a nova rota
      rotaControles.current[valorUsuario] = leaflet.Routing.control({
        show: false,
        waypoints: waypoints,
        routeWhileDragging: false,
        plan: plan,
        addWaypoints: false,
        fitSelectedRoutes: false,
        lineOptions: {
          styles: [{ weight: 4, color: cor, opacity: 1 }],
          extendToWaypoints: true,
          missingRouteTolerance: 1,
        },
      }).addTo(mapaPronto);
    }
  }

  // Mova a chamada do useEffect para fora do componente principal
  const atualizarRotas = useCallback(() => {
    if (!entregasDia || !entregasAndamento) return;

    const todasEntregas = entregasDia.concat(entregasAndamento);
    const entregasCategorizadas = categorizarEntregas(todasEntregas);

    const entregasOrdenadasMarcos = ordenarEntregasPorProximidade(
      entregasCategorizadas[0],
      {
        latitude: marcosUser.localizacao.latitude,
        longitude: marcosUser.localizacao.longitude,
      }
    );

    const entregasOrdenadaUene = ordenarEntregasPorProximidade(
      entregasCategorizadas[1],
      {
        latitude: ueneUser.localizacao.latitude,
        longitude: ueneUser.localizacao.longitude,
      }
    );

    const entregasOrdenadaLeo = ordenarEntregasPorProximidade(
      entregasCategorizadas[2],
      {
        latitude: leoUser.localizacao.latitude,
        longitude: leoUser.localizacao.longitude,
      }
    );

    const entregasOrdenadaJoao = ordenarEntregasPorProximidade(
      entregasCategorizadas[3],
      {
        latitude: joaoUser.localizacao.latitude,
        longitude: joaoUser.localizacao.longitude,
      }
    );

    // Desenhe as rotas diretamente sem chamar rotasEntregasMotoristas
    if (mapaPronto) {
      desenharRota(entregasOrdenadasMarcos, marcosUser, "#01c1fcc3");
      desenharRota(entregasOrdenadaUene, ueneUser, "#b90000c7");
      desenharRota(entregasOrdenadaLeo, leoUser, "#ffee00cf");
      desenharRota(entregasOrdenadaJoao, joaoUser, "#33ff0099");
    }
  }, [
    entregasDia,
    entregasAndamento,
    marcosUser.localizacao.latitude,
    marcosUser.localizacao.longitude,
    ueneUser.localizacao.latitude,
    ueneUser.localizacao.longitude,
    leoUser.localizacao.latitude,
    leoUser.localizacao.longitude,
    joaoUser.localizacao.latitude,
    joaoUser.localizacao.longitude,
    mapaPronto,
  ]);

  useEffect(() => {
    atualizarRotas();
  }, [atualizarRotas]);

  return (
    <div>
      <h1>teste</h1>
      <p>preenchendo</p>
    </div>
  );
}

export function categorizarEntregas(todasEntregas: entregasTipo[]) {
  const entregasMarcos: entregasTipo[] = [];
  const entregasUene: entregasTipo[] = [];
  const entregasLeo: entregasTipo[] = [];
  const entregasJoao: entregasTipo[] = [];

  todasEntregas.forEach((entrega) => {
    switch (entrega.entregador) {
      case "Marcos":
        entregasMarcos.push(entrega);
        break;
      case "Uene":
        entregasUene.push(entrega);
        break;
      case "Leo":
        entregasLeo.push(entrega);
        break;
      case "João":
        entregasJoao.push(entrega);
        break;
      default:
        break;
    }
  });

  return [entregasMarcos, entregasUene, entregasLeo, entregasJoao];
}

function calcularDistancia(
  coord1: {
    latitude: number;
    longitude: number;
  },
  coord2: {
    latitude: number;
    longitude: number;
  }
) {
  const R = 6371; // Raio da Terra em km
  const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
  const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.latitude * (Math.PI / 180)) *
      Math.cos(coord2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Distância em km
  return distancia;
}

function ordenarEntregasPorProximidade(
  entregas: entregasTipo[],
  coordenadasIniciais: { latitude: number; longitude: number }
) {
  const entregasOrdenadas = [];
  let coordenadasAtuais = coordenadasIniciais;

  while (entregas.length > 0) {
    let entregaMaisProximaIndex = 0;
    let menorDistancia = calcularDistancia(
      coordenadasAtuais,
      entregas[0].coordenadas
    );

    for (let i = 1; i < entregas.length; i++) {
      const distancia = calcularDistancia(
        coordenadasAtuais,
        entregas[i].coordenadas
      );
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        entregaMaisProximaIndex = i;
      }
    }

    const entregaMaisProxima = entregas.splice(entregaMaisProximaIndex, 1)[0];
    entregasOrdenadas.push(entregaMaisProxima);
    coordenadasAtuais = entregaMaisProxima.coordenadas;
  }

  return entregasOrdenadas;
}
