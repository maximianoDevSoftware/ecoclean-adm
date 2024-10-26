import { LatLngExpression } from "leaflet";

export async function end4Coords(endereco: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${endereco}&format=json&addressdetails=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("Address not found");
    }
    const coordinates = data[0].boundingbox;
    const latitude = parseFloat(coordinates[0]) as number;
    const longitude = parseFloat(coordinates[2]) as number;
    let meusValores = [latitude, longitude] as number[];
    return meusValores;
  } catch (error) {
    let meusValores = [-25.8242341, -48.5410957] as number[];
    return meusValores;
  }
}

export const gerandoDia = (): number[] => {
  const dataAgora = new Date();

  const dia = dataAgora.getDate();
  const mes = dataAgora.getMonth() + 1; // Mês começa em 0 (janeiro), então adicionamos 1
  const ano = dataAgora.getFullYear();

  const numDia: number[] = [dia, mes, ano];
  return numDia;
};
