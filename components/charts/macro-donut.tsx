"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function MacroDonut({
  protein,
  carbs,
  fats
}: {
  protein: number;
  carbs: number;
  fats: number;
}) {
  const data = [
    { name: "Protein", value: Math.round(protein * 4), color: "#74a56f" },
    { name: "Carbs", value: Math.round(carbs * 4), color: "#e6ad4b" },
    { name: "Fats", value: Math.round(fats * 9), color: "#ef786f" }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} kcal`, ""]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,.08)",
              boxShadow: "0 16px 40px rgba(0,0,0,.12)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
