"use client";
import { useContext } from "react";
import { TranslateContext } from "./GoogleTranslateProvider";

export const useGoogleTranslate = () => {
  const ctx = useContext(TranslateContext);
  if (!ctx) throw new Error("useGoogleTranslate must be used inside GoogleTranslateProvider");
  return ctx;
};

export default useGoogleTranslate;
