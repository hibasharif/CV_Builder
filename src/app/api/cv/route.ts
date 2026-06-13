import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { defaultCVData } from "@/types/cv";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cvs = await prisma.cV.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, template: true, updatedAt: true, createdAt: true },
  });
  return NextResponse.json(cvs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const cv = await prisma.cV.create({
    data: {
      userId: session.user.id,
      title: body.title ?? "My CV",
      template: body.template ?? "modern",
      data: body.data ?? defaultCVData,
    },
  });
  return NextResponse.json(cv, { status: 201 });
}
