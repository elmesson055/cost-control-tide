
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) => {
  const getTrendColor = () => {
    if (trend === undefined) return "";
    return trend > 0 ? "text-finance-income" : trend < 0 ? "text-finance-expense" : "";
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    return trend > 0 ? "↑" : trend < 0 ? "↓" : "→";
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend !== undefined && (
            <span className={cn("text-xs mr-1", getTrendColor())}>
              {getTrendIcon()} {trend}%
            </span>
          )}
          {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
