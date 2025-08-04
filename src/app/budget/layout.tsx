import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { PieChart } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const BudgetLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={PieChart}
        title="Budget"
        description="Manage your monthly budgets"
        iconBgColor="bg-yellow-600"
      />
      {children}
    </div>
  );
};

export default BudgetLayout;
