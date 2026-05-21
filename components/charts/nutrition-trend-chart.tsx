"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrendDatum = {
  date: string;
  calories?: number;
  protein?: number;
  deficit?: number;
};

export function NutritionTrendChart({
  data,
  mode = "calories"
}: {
  data: TrendDatum[];
  mode?: "calories" | "protein" | "deficit";
}) {
  const color = mode === "protein" ? "#74a56f" : mode === "deficit" ? "#55b7be" : "#ef786f";

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`cutmode-${mode}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.32} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ stroke: color, strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,.08)",
              boxShadow: "0 16px 40px rgba(0,0,0,.12)"
            }}
          />
          <Area
            type="monotone"
            dataKey={mode}
            stroke={color}
            strokeWidth={3}
            fill={`url(#cutmode-${mode})`}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
