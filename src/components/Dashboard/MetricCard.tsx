import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  gradient = false 
}: MetricCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-medium border-border/50",
      gradient && "bg-gradient-primary text-primary-foreground border-primary/20"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-sm font-medium",
          gradient ? "text-primary-foreground/90" : "text-muted-foreground"
        )}>
          {title}
        </CardTitle>
        <Icon className={cn(
          "h-5 w-5",
          gradient ? "text-primary-foreground/80" : "text-muted-foreground"
        )} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {change && (
          <p className={cn(
            "text-xs flex items-center gap-1",
            gradient 
              ? "text-primary-foreground/70" 
              : changeType === 'positive' 
                ? "text-success" 
                : changeType === 'negative' 
                  ? "text-destructive" 
                  : "text-muted-foreground"
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;