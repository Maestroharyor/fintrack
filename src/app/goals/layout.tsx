import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Target } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const GoalsLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Target}
        title="Goals"
        description="Track your financial goals and savings targets"
        iconBgColor="bg-green-600"
      />
      {children}
    </div>
  );
};

export default GoalsLayout;
