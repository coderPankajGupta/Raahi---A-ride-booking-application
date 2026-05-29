"use client";
import { MapContainer, TileLayer } from "react-leaflet";

type props = {
  pickUp: string;
  drop: string;
  onChange: (p: string, d: string) => void;
  onDistance: (d: number) => void;
};

export default function SearchMap({
  pickUp,
  drop,
  onChange,
  onDistance,
}: props) {
  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
