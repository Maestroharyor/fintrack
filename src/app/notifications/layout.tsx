import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Bell } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const NotificationsLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Bell}
        title="Notifications"
        description="Manage your notification preferences"
        iconBgColor="bg-orange-600"
      />
      {children}
    </div>
  );
};

export default NotificationsLayout;
