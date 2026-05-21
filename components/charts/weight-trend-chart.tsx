"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type WeightDatum = {
  date: string;
  weight: number;
  average: number;
  bodyFat: number;
};

export function WeightTrendChart({ data }: { data: WeightDatum[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -18, right: 8, top: 12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} domain={["dataMin - .5", "dataMax + .5"]} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,.08)",
              boxShadow: "0 16px 40px rgba(0,0,0,.12)"
            }}
          />
          <Line type="monotone" dataKey="weight" stroke="#ef786f" strokeWidth={2} dot={false} name="Daily weight" />
          <Line type="monotone" dataKey="average" stroke="#55b7be" strokeWidth={3} dot={{ r: 3 }} name="Weekly average" />
          <Line type="monotone" dataKey="bodyFat" stroke="#a767aa" strokeWidth={2} dot={false} name="Body fat %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
