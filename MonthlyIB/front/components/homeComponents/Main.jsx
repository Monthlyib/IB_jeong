"use client";

import { useEffect, useState } from "react";
import { openAPIGetHomeLayout } from "@/apis/homeLayoutAPI";
import HomeLayoutRenderer from "./layout/HomeLayoutRenderer";
import { createDefaultHomeLayout, normalizeHomeLayout } from "./layout/homeLayoutDefaults";

const Main = () => {
  const [layout, setLayout] = useState(createDefaultHomeLayout());

  useEffect(() => {
    let mounted = true;

    const fetchLayout = async () => {
      const response = await openAPIGetHomeLayout();
      const nextLayout =
        normalizeHomeLayout(response?.data?.layout || createDefaultHomeLayout());
      if (mounted) {
        setLayout(nextLayout);
      }
    };

    fetchLayout();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <HomeLayoutRenderer layout={layout} />
    </main>
  );
};

export default Main;
