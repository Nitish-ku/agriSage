import { cn } from "@/lib/utils";

interface StatCardProps {
  stat: string;
  description: string;
  className?: string;
}

export const StatCard = ({ stat, description, className }: StatCardProps) => {
  return (
    <div className={cn(
      "bg-gradient-card p-6 rounded-lg shadow-card hover:shadow-elegant transition-all duration-300",
      "border border-border/50 backdrop-blur-sm",
      className
    )}>
      <div className="text-3xl font-bold text-kerala-primary mb-2">{stat}</div>
      <div className="text-muted-foreground text-sm">{description}</div>
    </div>
  );
};