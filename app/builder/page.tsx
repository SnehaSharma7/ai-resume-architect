import BuilderClient from "./BuilderClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder – CareerForge Pro",
  description: "Build and optimize your ATS-proof resume with live preview and AI rewriting.",
};

export default function BuilderPage() {
  return <BuilderClient />;
}
