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
import type { StructuredSkillSheet } from "@/lib/validations";

type SkillSheetAnalysisProps = {
  data: StructuredSkillSheet;
};

type SkillCategory = {
  label: string;
  count: number;
  items: string[];
};

type ProcessCoverage = {
  label: string;
  score: number;
  evidence: string[];
};

type CareerTrend = {
  label: string;
  score: number;
  evidence: string[];
};

const LABELS = {
  title: "\u30b9\u30ad\u30eb\u30b7\u30fc\u30c8\u8a73\u7d30\u5206\u6790",
  subtitle:
    "\u4fdd\u6709\u30b9\u30ad\u30eb\u30fb\u7d4c\u9a13\u5de5\u7a0b\u30fb\u30ad\u30e3\u30ea\u30a2\u50be\u5411\u3092\u3001\u767b\u9332\u3055\u308c\u305f\u30b9\u30ad\u30eb\u30b7\u30fc\u30c8\u5185\u5bb9\u304b\u3089\u53ef\u8996\u5316\u3057\u307e\u3059\u3002",
  skills: "\u4fdd\u6709\u30b9\u30ad\u30eb",
  processes: "\u7d4c\u9a13\u5de5\u7a0b",
  career: "\u30ad\u30e3\u30ea\u30a2\u50be\u5411",
  totalSkills: "\u62bd\u51fa\u30b9\u30ad\u30eb\u6570",
  processCoverage: "\u5de5\u7a0b\u30ab\u30d0\u30fc",
  projectCount: "\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u6570",
  comment: "\u5206\u6790\u30b3\u30e1\u30f3\u30c8",
  evidence: "\u6839\u62e0",
  noData: "\u30c7\u30fc\u30bf\u304c\u672a\u767b\u9332\u3067\u3059",
};

const skillCategoryDefinitions = [
  ["languages", "\u4f7f\u7528\u8a00\u8a9e"],
  ["frameworks", "\u30d5\u30ec\u30fc\u30e0\u30ef\u30fc\u30af"],
  ["databases", "DB"],
  ["cloud", "\u30af\u30e9\u30a6\u30c9"],
  ["os", "OS"],
  ["tools", "\u30c4\u30fc\u30eb"],
] as const;

const processDefinitions = [
  {
    label: "\u8981\u4ef6\u5b9a\u7fa9",
    keywords: ["\u8981\u4ef6", "\u30d2\u30a2\u30ea\u30f3\u30b0"],
  },
  {
    label: "\u57fa\u672c\u8a2d\u8a08",
    keywords: ["\u57fa\u672c\u8a2d\u8a08", "\u5916\u90e8\u8a2d\u8a08"],
  },
  {
    label: "\u8a73\u7d30\u8a2d\u8a08",
    keywords: ["\u8a73\u7d30\u8a2d\u8a08", "\u5185\u90e8\u8a2d\u8a08"],
  },
  {
    label: "\u5b9f\u88c5",
    keywords: ["\u5b9f\u88c5", "\u958b\u767a", "\u88fd\u9020", "\u30b3\u30fc\u30c7\u30a3\u30f3\u30b0"],
  },
  {
    label: "\u5358\u4f53\u30c6\u30b9\u30c8",
    keywords: ["\u5358\u4f53", "UT"],
  },
  {
    label: "\u7d50\u5408\u30c6\u30b9\u30c8",
    keywords: ["\u7d50\u5408", "IT"],
  },
  {
    label: "\u7dcf\u5408\u30c6\u30b9\u30c8",
    keywords: ["\u7dcf\u5408", "\u30b7\u30b9\u30c6\u30e0\u30c6\u30b9\u30c8", "ST"],
  },
  {
    label: "\u4fdd\u5b88\u30fb\u904b\u7528",
    keywords: ["\u4fdd\u5b88", "\u904b\u7528", "\u969c\u5bb3", "\u6539\u4fee"],
  },
];

const careerTrendDefinitions = [
  {
    label: "\u30d0\u30c3\u30af\u30a8\u30f3\u30c9",
    keywords: [
      "java",
      "spring",
      "php",
      "laravel",
      "python",
      "go",
      "api",
      "\u30b5\u30fc\u30d0",
      "\u30d0\u30c3\u30af\u30a8\u30f3\u30c9",
    ],
  },
  {
    label: "\u30d5\u30ed\u30f3\u30c8\u30a8\u30f3\u30c9",
    keywords: [
      "javascript",
      "typescript",
      "react",
      "next",
      "vue",
      "html",
      "css",
      "\u753b\u9762",
      "\u30d5\u30ed\u30f3\u30c8",
    ],
  },
  {
    label: "\u30af\u30e9\u30a6\u30c9\u30fb\u30a4\u30f3\u30d5\u30e9",
    keywords: [
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "linux",
      "\u30a4\u30f3\u30d5\u30e9",
      "\u30af\u30e9\u30a6\u30c9",
    ],
  },
  {
    label: "\u8a2d\u8a08\u30fb\u4e0a\u6d41",
    keywords: [
      "\u8981\u4ef6\u5b9a\u7fa9",
      "\u57fa\u672c\u8a2d\u8a08",
      "\u8a73\u7d30\u8a2d\u8a08",
      "\u4ed5\u69d8\u8abf\u6574",
      "\u30ec\u30d3\u30e5\u30fc",
    ],
  },
  {
    label: "\u30c6\u30b9\u30c8\u30fb\u54c1\u8cea",
    keywords: [
      "\u5358\u4f53\u30c6\u30b9\u30c8",
      "\u7d50\u5408\u30c6\u30b9\u30c8",
      "\u30c6\u30b9\u30c8",
      "\u54c1\u8cea",
      "qa",
    ],
  },
  {
    label: "\u30ea\u30fc\u30c9\u30fb\u8abf\u6574",
    keywords: [
      "\u30ea\u30fc\u30c0",
      "\u30b5\u30d6\u30ea\u30fc\u30c0",
      "\u7ba1\u7406",
      "\u8abf\u6574",
      "\u30de\u30cd\u30b8\u30e1\u30f3\u30c8",
      "\u9867\u5ba2\u6298\u885d",
    ],
  },
];

export function SkillSheetAnalysis({ data }: SkillSheetAnalysisProps) {
  const skills = buildSkillCategories(data);
  const processes = buildProcessCoverage(data);
  const careerTrends = buildCareerTrends(data);
  const totalSkills = uniqueStrings(skills.flatMap((item) => item.items)).length;
  const coveredProcesses = processes.filter((item) => item.score > 0).length;
  const projectCount = data.projects?.length ?? 0;

  return (
    <section className="space-y-6 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-semibold">{LABELS.title}</h2>
        <p className="mt-2 text-sm leading-7 text-zinc-600">{LABELS.subtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label={LABELS.totalSkills} value={`${totalSkills}`} />
        <MetricCard
          label={LABELS.processCoverage}
          value={`${coveredProcesses}/${processes.length}`}
        />
        <MetricCard label={LABELS.projectCount} value={`${projectCount}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalysisCard title={LABELS.skills} comment={buildSkillComment(skills)}>
          <ChartFrame>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills} layout="vertical" margin={{ left: 48 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={96}
                  tick={{ fontSize: 11 }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
          <SkillCategoryList categories={skills} />
        </AnalysisCard>

        <AnalysisCard
          title={LABELS.processes}
          comment={buildProcessComment(processes)}
        >
          <ChartFrame>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processes} layout="vertical" margin={{ left: 48 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={96}
                  tick={{ fontSize: 11 }}
                />
                <Bar dataKey="score" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
          <EvidenceList items={processes.filter((item) => item.score > 0)} />
        </AnalysisCard>
      </div>

      <AnalysisCard title={LABELS.career} comment={buildCareerComment(careerTrends)}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ChartFrame>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={careerTrends}>
                <PolarGrid />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name={LABELS.career}
                  dataKey="score"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartFrame>
          <CareerTrendList trends={careerTrends} />
        </div>
      </AnalysisCard>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function AnalysisCard({
  title,
  comment,
  children,
}: {
  title: string;
  comment: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
      <div>
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-zinc-700">
          <span className="font-medium text-zinc-900">{LABELS.comment}: </span>
          {comment}
        </p>
      </div>
      {children}
    </div>
  );
}

function ChartFrame({ children }: { children: React.ReactNode }) {
  return <div className="h-72 w-full sm:h-80">{children}</div>;
}

function SkillCategoryList({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {categories.map((category) => (
        <div key={category.label} className="rounded-md bg-white p-3 text-sm">
          <p className="font-medium">{category.label}</p>
          <p className="mt-1 break-words text-zinc-600">
            {category.items.length > 0 ? category.items.join(" / ") : LABELS.noData}
          </p>
        </div>
      ))}
    </div>
  );
}

function EvidenceList({ items }: { items: ProcessCoverage[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">{LABELS.noData}</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md bg-white p-3 text-sm">
          <p className="font-medium">{item.label}</p>
          <p className="mt-1 break-words text-zinc-600">
            {LABELS.evidence}: {item.evidence.slice(0, 4).join(" / ")}
          </p>
        </div>
      ))}
    </div>
  );
}

function CareerTrendList({ trends }: { trends: CareerTrend[] }) {
  return (
    <div className="space-y-3">
      {trends
        .filter((trend) => trend.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((trend) => (
          <div key={trend.label} className="rounded-md bg-white p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{trend.label}</p>
              <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700">
                {trend.score}
              </span>
            </div>
            <p className="mt-1 break-words text-zinc-600">
              {trend.evidence.slice(0, 6).join(" / ")}
            </p>
          </div>
        ))}
    </div>
  );
}

function buildSkillCategories(data: StructuredSkillSheet): SkillCategory[] {
  const projectTechnologies = uniqueStrings(
    (data.projects ?? []).flatMap((project) => project.technologies ?? []),
  );

  const baseCategories = skillCategoryDefinitions.map(([key, label]) => {
    const items = uniqueStrings(data.skills?.[key] ?? []);
    return { label, count: items.length, items };
  });

  return [
    ...baseCategories,
    {
      label: "\u6848\u4ef6\u4f7f\u7528\u6280\u8853",
      count: projectTechnologies.length,
      items: projectTechnologies,
    },
    {
      label: "\u8cc7\u683c",
      count: uniqueStrings(data.qualifications ?? []).length,
      items: uniqueStrings(data.qualifications ?? []),
    },
  ];
}

function buildProcessCoverage(data: StructuredSkillSheet): ProcessCoverage[] {
  const processSources = [
    ...(data.processes ?? []),
    ...(data.projects ?? []).flatMap((project) => [
      project.summary ?? "",
      project.role ?? "",
      ...(project.tasks ?? []),
    ]),
  ].filter(Boolean);

  return processDefinitions.map((definition) => {
    const evidence = processSources.filter((source) =>
      definition.keywords.some((keyword) =>
        source.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );

    return {
      label: definition.label,
      score: Math.min(evidence.length * 35, 100),
      evidence: uniqueStrings(evidence),
    };
  });
}

function buildCareerTrends(data: StructuredSkillSheet): CareerTrend[] {
  const sources = [
    ...Object.values(data.skills ?? {}).flatMap((items) => items ?? []),
    ...(data.processes ?? []),
    ...(data.qualifications ?? []),
    ...(data.preferred_tasks ?? []),
    ...(data.weak_tasks ?? []),
    ...(data.strengths_from_skill_sheet ?? []),
    ...(data.weaknesses_from_skill_sheet ?? []),
    ...(data.career_keywords ?? []),
    data.self_pr ?? "",
    ...(data.projects ?? []).flatMap((project) => [
      project.summary ?? "",
      project.role ?? "",
      ...(project.tasks ?? []),
      ...(project.technologies ?? []),
    ]),
  ].filter(Boolean);

  return careerTrendDefinitions.map((definition) => {
    const evidence = sources.filter((source) =>
      definition.keywords.some((keyword) =>
        source.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
    const uniqueEvidence = uniqueStrings(evidence);

    return {
      label: definition.label,
      score: Math.min(uniqueEvidence.length * 18, 100),
      evidence: uniqueEvidence,
    };
  });
}

function buildSkillComment(categories: SkillCategory[]) {
  const top = [...categories].sort((a, b) => b.count - a.count)[0];
  if (!top || top.count === 0) {
    return "\u6280\u8853\u30b9\u30ad\u30eb\u306e\u62bd\u51fa\u304c\u5c11\u306a\u3044\u305f\u3081\u3001\u4f7f\u7528\u8a00\u8a9e\u30fb\u30d5\u30ec\u30fc\u30e0\u30ef\u30fc\u30af\u30fbDB\u30fb\u30c4\u30fc\u30eb\u3092\u8ffd\u8a18\u3059\u308b\u3068\u5206\u6790\u7cbe\u5ea6\u304c\u4e0a\u304c\u308a\u307e\u3059\u3002";
  }
  return `${top.label}\u304c\u6700\u3082\u591a\u304f\u3001${top.items
    .slice(0, 3)
    .join(
      "\u30fb",
    )}\u3092\u4e2d\u5fc3\u306b\u5b9f\u52d9\u7d4c\u9a13\u3092\u8aac\u660e\u3057\u3084\u3059\u3044\u72b6\u614b\u3067\u3059\u3002\u9762\u8ac7\u7528\u306b\u306f\u300c\u3069\u306e\u6848\u4ef6\u3067\u4f7f\u3063\u305f\u304b\u300d\u307e\u3067\u8a00\u3048\u308b\u3068\u3088\u308a\u5f37\u304f\u306a\u308a\u307e\u3059\u3002`;
}

function buildProcessComment(processes: ProcessCoverage[]) {
  const covered = processes.filter((item) => item.score > 0);
  if (covered.length === 0) {
    return "\u62c5\u5f53\u5de5\u7a0b\u306e\u8a18\u8f09\u304c\u5c11\u306a\u3044\u305f\u3081\u3001\u8981\u4ef6\u5b9a\u7fa9\u304b\u3089\u30c6\u30b9\u30c8\u30fb\u4fdd\u5b88\u307e\u3067\u306e\u3069\u3053\u3092\u62c5\u5f53\u3057\u305f\u304b\u3092\u8ffd\u8a18\u3059\u308b\u3068\u6848\u4ef6\u9069\u6027\u3092\u5224\u65ad\u3057\u3084\u3059\u304f\u306a\u308a\u307e\u3059\u3002";
  }
  const top = covered.sort((a, b) => b.score - a.score)[0];
  return `${top.label}\u306e\u6839\u62e0\u304c\u591a\u304f\u3001\u3053\u306e\u5de5\u7a0b\u3092\u8ef8\u306b\u7d4c\u9a13\u3092\u8aac\u660e\u3057\u3084\u3059\u3044\u72b6\u614b\u3067\u3059\u3002\u4e0a\u6d41\u5de5\u7a0b\u3084\u30c6\u30b9\u30c8\u5de5\u7a0b\u306e\u8a18\u8f09\u304c\u8584\u3044\u5834\u5408\u306f\u3001\u5177\u4f53\u7684\u306a\u6210\u679c\u7269\u3084\u62c5\u5f53\u7bc4\u56f2\u3092\u8ffd\u8a18\u3059\u308b\u3068\u826f\u3044\u3067\u3059\u3002`;
}

function buildCareerComment(trends: CareerTrend[]) {
  const topTrends = [...trends]
    .filter((trend) => trend.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (topTrends.length === 0) {
    return "\u6280\u8853\u30fb\u696d\u52d9\u30ad\u30fc\u30ef\u30fc\u30c9\u304c\u5c11\u306a\u3044\u305f\u3081\u3001\u30ad\u30e3\u30ea\u30a2\u50be\u5411\u306f\u307e\u3060\u5224\u65ad\u3057\u306b\u304f\u3044\u72b6\u614b\u3067\u3059\u3002\u5f97\u610f\u696d\u52d9\u3084\u4eca\u5f8c\u4f38\u3070\u3057\u305f\u3044\u6280\u8853\u3092\u8ffd\u8a18\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
  }

  return `${topTrends
    .map((trend) => trend.label)
    .join(
      "\u30fb",
    )}\u5bc4\u308a\u306e\u50be\u5411\u304c\u898b\u3048\u307e\u3059\u3002\u5c06\u6765\u5206\u6790\u3084\u6848\u4ef6\u5bfe\u7b56\u3067\u306f\u3001\u3053\u306e\u8ef8\u306b\u6cbf\u3063\u3066\u300c\u5b9f\u7e3e\u300d\u3068\u300c\u4eca\u5f8c\u4f38\u3070\u3057\u305f\u3044\u9818\u57df\u300d\u3092\u5206\u3051\u3066\u8a00\u8a9e\u5316\u3059\u308b\u3068\u4f1d\u308f\u308a\u3084\u3059\u304f\u306a\u308a\u307e\u3059\u3002`;
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(normalized);
  }

  return result;
}
