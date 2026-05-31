"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";
import { MapPin, Navigation2 } from "lucide-react";

type props = {
  pickUp: string;
  drop: string;
  onChange: (p: string, d: string) => void;
  onDistance: (d: number) => void;
};

function FitBound({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.fitBounds([p1, p2], {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [p1, p2, map]);

  return null;
}

const pickUpIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
      
      <div
        style="
          background:black;
          color:white;
          padding:6px 12px;
          border-radius:8px;
          font-size:12px;
          font-weight:600;
          white-space:nowrap;
        "
      >
        Pickup
      </div>

      <div
        style="
          width:3px;
          height:12px;
          background:black;
        "
      ></div>

      <div
        style="
          width:0;
          height:0;
          border-left:8px solid transparent;
          border-right:8px solid transparent;
          border-top:14px solid black;
        "
      ></div>

    </div>`,
  className: "",
  iconSize: [90, 58],
});

const dropIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
      
      <div
        style="
          background:black;
          color:white;
          padding:6px 12px;
          border-radius:8px;
          font-size:12px;
          font-weight:600;
          white-space:nowrap;
        "
      >
        Drop
      </div>

      <div
        style="
          width:3px;
          height:12px;
          background:black;
        "
      ></div>

      <div
        style="
          width:0;
          height:0;
          border-left:8px solid transparent;
          border-right:8px solid transparent;
          border-top:14px solid black;
        "
      ></div>

    </div>`,
  className: "",
  iconSize: [90, 58],
});

export default function SearchMap({
  pickUp,
  drop,
  onChange,
  onDistance,
}: props) {
  const [p1, setP1] = useState<[number, number]>();
  const [p2, setP2] = useState<[number, number]>();
  const [route, setRoute] = useState<[number, number][]>([]);
  const [km, setKm] = useState<number | null>(0);
  const [ready, setReady] = useState(false);

  async function geoCoding(q: string): Promise<[number, number] | null> {
    try {
      const { data } = await axios.get(`https://photon.komoot.io/api/?q=${q}`);
      if (!data.features.length) return null;
      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function reverseGeoCoding(lat: number, lon: number) {
    const { data } = await axios.get(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`,
    );
    if (!data.features.length) return;
    const p = data.features[0].properties;
    return [p.name, p.street, p.locality, p.city, p.state, p.country]
      .filter(Boolean)
      .join(",");
  }

  async function loadRoute(p: [number, number], d: [number, number]) {
    try {
      const { data } = await axios.get(
        `http://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`,
      );
      if (!data.routes.length) return;
      setRoute(
        data.routes[0].geometry.coordinates.map(([lon, lat]: number[]) => [
          lat,
          lon,
        ]),
      );
      const distKm = +(data.routes[0].distance / 1000).toFixed(2);
      setKm(distKm);
      onDistance(distKm);
    } catch (error) {
      console.log(error);
    }
  }

  async function dragPickUp(lat: number, lon: number) {
    const addr = await reverseGeoCoding(lat, lon);
    setP1([lat, lon]);
    if (p2) {
      loadRoute([lat, lon], p2);
    }
    onChange(addr!, drop);
  }

  async function dragDrop(lat: number, lon: number) {
    const addr = await reverseGeoCoding(lat, lon);
    setP2([lat, lon]);
    if (p1) {
      loadRoute(p1, [lat, lon]);
    }
    onChange(drop, addr!);
  }

  useEffect(() => {
    setReady(false);
    if (pickUp && drop) {
      (async () => {
        const a = await geoCoding(pickUp);
        const b = await geoCoding(drop);
        if (!a || !b) {
          return;
        }
        await loadRoute(a, b);
        setP1(a);
        setP2(b);
        setReady(true);
      })();
    }
  }, [pickUp, drop]);

  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [0, 0]}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com">"CARTO"</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        {p1 && p2 && <FitBound p1={p1} p2={p2} />}
        {p1 && (
          <Marker
            position={p1}
            icon={pickUpIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragPickUp(m.lat, m.lng);
              },
            }}
          />
        )}
        {p2 && (
          <Marker
            position={p2}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragDrop(m.lat, m.lng);
              },
            }}
          />
        )}

        {route.length > 0 && (
          <>
            <Polyline positions={route} pathOptions={{ color: "#0a0a0a" }} />
          </>
        )}
      </MapContainer>

      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-999 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="relative w-14 h-14 flex items-center justify-center ">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-transparent border-t-zinc-300"
              />

              <MapPin size={15} className="text-zinc-800" />
            </div>

            <div className="text-center">
              <p className="text-zinc-900 text-xs font-black tracking-[0.22em] uppercase ">
                Loading Map
              </p>
              <p className="text-zinc-400 text-[10px] font-medium tracking-wider mt-0.5 ">
                Plotting your route...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ready && km !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 left-4 z-500 flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg"
          >
            <Navigation2 size={13} className="text-zinc-900" />
            <span className="text-zinc-900 text-xs font-bold">{km} km</span>
            <span className="w-px h-3 bg-zinc-200" />
            <span> ~{Math.max(3, Math.round((km / 25) * 60))} min </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
