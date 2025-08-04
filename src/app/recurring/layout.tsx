import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Repeat } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const RecurringLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Repeat}
        title="Recurring"
        description="Manage your recurring transactions"
        iconBgColor="bg-purple-600"
      />
      {children}
    </div>
  );
};

export default RecurringLayout;
