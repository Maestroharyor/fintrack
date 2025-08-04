import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { TrendingUp } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const IncomeLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={TrendingUp}
        title="Income"
        description="Track and manage your income sources"
        iconBgColor="bg-green-600"
      />
      {children}
    </div>
  );
};

export default IncomeLayout;
