import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { TrendingDown } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const ExpensesLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={TrendingDown}
        title="Expenses"
        description="Track and manage your expenses"
        iconBgColor="bg-red-600"
      />
      {children}
    </div>
  );
};

export default ExpensesLayout;
