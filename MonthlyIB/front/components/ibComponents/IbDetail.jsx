"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useIBStore } from "@/store/ib";
import { useRouter } from "next/navigation";
const IbDetail = (pageId) => {
  const { data: session } = useSession();
  const { getIBItem, ibDetail } = useIBStore();
  const router = useRouter();
  useEffect(() => {
    getIBItem(pageId?.pageId, session);
    router.push(ibDetail?.pdfFiles[0].fileUrl);
  }, []);
  return <></>;
};

export default IbDetail;
