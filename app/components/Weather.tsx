"use client";

import { useEffect, useState } from "react";
import {
  Cloud, CloudDrizzle, CloudFog, CloudHail, CloudLightning, CloudMoon,
  CloudRain, CloudSnow, CloudSun, Moon, Sun, Wind, Droplets,
  type LucideIcon,
} from "lucide-react";

/* Open-Meteo：免费、无需 key */
const CITIES = [
  {
    name: "广州",
    en: "GUANGZHOU · EE",
    lat: 23.13,
    lon: 113.26,
    sub: "纸片君在这里",
    accent: "from-[#EAF8E6] to-[#C9E7C4]",
  },
  {
    name: "拉萨",
    en: "LHASA · SU",
    lat: 29.65,
    lon: 91.14,
    sub: "苏淋在这里",
    accent: "from-[#FDE9F1] to-[#F6C9D9]",
  },
];

const WMO: Record<number, { text: string; Icon: LucideIcon }> = {
  0: { text: "晴", Icon: Sun },
  1: { text: "大致晴朗", Icon: CloudSun },
  2: { text: "多云", Icon: Cloud },
  3: { text: "阴", Icon: Cloud },
  45: { text: "雾", Icon: CloudFog },
  48: { text: "雾凇", Icon: CloudFog },
  51: { text: "小毛雨", Icon: CloudDrizzle },
  53: { text: "毛雨", Icon: CloudDrizzle },
  55: { text: "大毛雨", Icon: CloudDrizzle },
  61: { text: "小雨", Icon: CloudRain },
  63: { text: "中雨", Icon: CloudRain },
  65: { text: "大雨", Icon: CloudHail },
  71: { text: "小雪", Icon: CloudSnow },
  73: { text: "中雪", Icon: CloudSnow },
  75: { text: "大雪", Icon: CloudSnow },
  80: { text: "阵雨", Icon: CloudRain },
  81: { text: "强阵雨", Icon: CloudRain },
  82: { text: "暴雨", Icon: CloudHail },
  85: { text: "阵雪", Icon: CloudSnow },
  86: { text: "强阵雪", Icon: CloudSnow },
  95: { text: "雷雨", Icon: CloudLightning },
  96: { text: "雷雨伴冰雹", Icon: CloudLightning },
  99: { text: "强雷雨", Icon: CloudLightning },
};

/* 大气压 -> 高原直感文案 */
function vibe(cityIdx: number, temp: number, code: number, night: boolean) {
  const w = WMO[code] ?? { text: "未知", Icon: Moon };
  const bits: string[] = [];
  bits.push(night ? "夜里" : "白天");
  if (cityIdx === 1 && temp < 12) bits.push("高原的风有点硬");
  else if (cityIdx === 0 && temp > 26) bits.push("海边城市有点黏");
  else bits.push("刚刚好的温度");
  bits.push(w.text);
  return bits.join("，");
}

type CityData = {
  temp: number;
  code: number;
  humidity: number;
  wind: number;
};

export default function Weather() {
  const [data, setData] = useState<(CityData | null)[]>([null, null]);
  const [ok, setOk] = useState(false);
  const [night, setNight] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setNight(h >= 19 || h < 6);
    Promise.all(
      CITIES.map(async (c) => {
        const r = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`
        );
        const j = await r.json();
        return {
          temp: Math.round(j.current.temperature_2m),
          code: j.current.weather_code,
          humidity: j.current.relative_humidity_2m,
          wind: Math.round(j.current.wind_speed_10m),
        } as CityData;
      })
    )
      .then((all) => {
        setData(all);
        setOk(true);
      })
      .catch(() => {
        // fallback：写死的平均参考值
        setData([
          { temp: 27, code: 1, humidity: 72, wind: 10 },
          { temp: 12, code: 1, humidity: 32, wind: 14 },
        ]);
        setOk(false);
      });
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {CITIES.map((c, i) => {
        const d = data[i];
        const w = d ? (WMO[d.code] ?? { text: "未知", Icon: night ? Moon : Sun }) : null;
        const Icon = w?.Icon ?? (night ? Moon : Sun);
        return (
          <div
            key={c.name}
            className={`lift border-2 border-black rounded-3xl p-7 bg-gradient-to-b ${c.accent} hard-shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-bold tracking-[0.18em] opacity-70">{c.en}</span>
                <h4 className="text-[22px] font-black mt-1" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  {c.name}
                </h4>
              </div>
              <span className="animate-floaty text-ink">
                <Icon size={34} strokeWidth={1.8} />
              </span>
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span className="font-bold leading-none" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: 56 }}>
                {d ? d.temp : "--"}
                <span className="text-[20px] align-top">°</span>
              </span>
              <span className="mb-2 text-[13px] font-bold">{w?.text ?? "加载中"}</span>
            </div>

            <p className="mt-2 text-[13px] font-medium text-[#3d3836]">{c.sub}</p>

            <div className="mt-5 flex gap-2 flex-wrap">
              <span className="bg-white border-[1.5px] border-black rounded-full px-3 py-1.5 text-[12px] font-bold flex items-center gap-1.5">
                <Droplets size={13} />{d ? `${d.humidity}% 湿度` : "湿度 --"}
              </span>
              <span className="bg-white border-[1.5px] border-black rounded-full px-3 py-1.5 text-[12px] font-bold flex items-center gap-1.5">
                <Wind size={13} />{d ? `${d.wind} km/h` : "风速 --"}
              </span>
            </div>

            <p className="mt-4 text-[12.5px] leading-6 text-[#5b5553]">
              {d ? vibe(i, d.temp, d.code, night) : "在这边等天气数据…"}
              {!ok && d ? " · 离线参考值" : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
