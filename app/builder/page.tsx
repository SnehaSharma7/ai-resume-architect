import BuilderClient from "./BuilderClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder – CareerForge Pro",
  description: "Build and optimize your ATS-proof resume with live preview and AI rewriting.",
};

type BuilderPageProps = {
  searchParams: Promise<{ resumeId?: string }>;
};

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const resolvedParams = await searchParams;
  const resumeId = Number(resolvedParams.resumeId);

  return <BuilderClient resumeId={Number.isInteger(resumeId) && resumeId > 0 ? resumeId : null} />;
}
