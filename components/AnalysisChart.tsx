"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_DEFINITIONS } from "@/lib/analysis";

type AnalysisChartProps = {
  scores: Record<string, number>;
};

export function AnalysisChart({ scores }: AnalysisChartProps) {
  const data = CATEGORY_DEFINITIONS.map((c) => ({
    category: c.label,
    tendency: scores[c.key] ?? 0,
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-4 font-semibold">回答傾向チャート</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="回答傾向"
                dataKey="tendency"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="mb-4 font-semibold">カテゴリ別の回答傾向</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={false} />
              <YAxis
                type="category"
                dataKey="category"
                width={120}
                tick={{ fontSize: 11 }}
              />
              <Bar dataKey="tendency" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
