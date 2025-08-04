import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor: string;
  children?: ReactNode;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  iconBgColor,
  children,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-xl ${iconBgColor} flex items-center justify-center`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
