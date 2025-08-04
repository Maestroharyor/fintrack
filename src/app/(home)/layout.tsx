import React from "react";
import { HomeHeader } from "@/components/HomeHeader";

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      {children}
    </div>
  );
};

export default HomeLayout;
