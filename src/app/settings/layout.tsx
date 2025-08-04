import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Settings } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const SettingsLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Customize your app preferences"
        iconBgColor="bg-gray-600"
      />
      {children}
    </div>
  );
};

export default SettingsLayout;
