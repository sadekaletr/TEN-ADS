export interface SyriaRegionGeometry {
  governorate: string;
  path: string;
  centroid: [number, number];
}

/** Stylized Syria governorate paths (geography-readable, not survey-grade). */
export const SYRIA_MAP_REGIONS: SyriaRegionGeometry[] = [
  {
    governorate: "دمشق",
    path: "M195,155 L210,155 L210,170 L195,170 Z",
    centroid: [202, 162],
  },
  {
    governorate: "ريف دمشق",
    path: "M175,140 L225,140 L235,175 L225,200 L170,200 L160,175 Z",
    centroid: [195, 172],
  },
  {
    governorate: "حلب",
    path: "M120,55 L200,50 L210,95 L195,120 L115,115 L105,80 Z",
    centroid: [155, 82],
  },
  {
    governorate: "إدلب",
    path: "M95,95 L155,90 L165,125 L145,145 L85,140 L80,110 Z",
    centroid: [120, 118],
  },
  {
    governorate: "حمص",
    path: "M155,125 L210,120 L220,155 L200,175 L150,170 L145,140 Z",
    centroid: [180, 148],
  },
  {
    governorate: "حماة",
    path: "M130,145 L175,140 L185,175 L170,200 L125,195 L120,165 Z",
    centroid: [152, 172],
  },
  {
    governorate: "اللاذقية",
    path: "M55,115 L95,105 L105,145 L90,175 L50,165 L45,135 Z",
    centroid: [72, 142],
  },
  {
    governorate: "طرطوس",
    path: "M70,175 L115,170 L125,210 L105,235 L65,225 L60,195 Z",
    centroid: [90, 202],
  },
  {
    governorate: "الرقة",
    path: "M210,75 L290,70 L300,115 L285,140 L205,130 L200,95 Z",
    centroid: [248, 102],
  },
  {
    governorate: "دير الزور",
    path: "M285,95 L360,90 L370,140 L355,175 L280,165 L275,120 Z",
    centroid: [322, 132],
  },
  {
    governorate: "السويداء",
    path: "M175,205 L225,200 L235,240 L215,265 L165,260 L155,225 Z",
    centroid: [195, 232],
  },
  {
    governorate: "درعا",
    path: "M155,225 L200,220 L210,255 L190,280 L145,275 L140,245 Z",
    centroid: [173, 252],
  },
  {
    governorate: "القنيطرة",
    path: "M130,200 L165,195 L175,225 L160,250 L125,245 L118,215 Z",
    centroid: [147, 222],
  },
];

export const SYRIA_MAP_VIEWBOX = "0 0 400 280";
