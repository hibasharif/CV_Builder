import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BuilderClient } from "./BuilderClient";
import { CVData, CVTemplate } from "@/types/cv";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  const { id } = await params;

  const cv = await prisma.cV.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!cv) notFound();

  return (
    <BuilderClient
      cvId={cv.id}
      initialTitle={cv.title}
      initialTemplate={cv.template as CVTemplate}
      initialData={cv.data as unknown as CVData}
    />
  );
}
