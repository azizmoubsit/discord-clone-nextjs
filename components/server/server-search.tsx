"use client";

import { ReactNode } from "react";

interface SearchServerProps {
  data: {
    label: string;
    type: "channel" | "member";
    data: {
          icon: ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: SearchServerProps) => {
  return <div>Server search component</div>;
};
