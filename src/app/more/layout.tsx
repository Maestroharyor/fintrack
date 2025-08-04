import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { MoreHorizontal } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const MoreLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={MoreHorizontal}
        title="More"
        description="Additional tools and settings"
        iconBgColor="bg-gray-600"
      />
      {children}
    </div>
  );
};

export default MoreLayout;
