import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1e2330] to-[#1a1d29] border border-white/10 p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Icon className="h-5 w-5 text-blue-400" />
          </div>
        </div>

        <div className="mb-2">
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>

        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-semibold ${
                  trend.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-gray-500">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
