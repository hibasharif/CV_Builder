import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const cv = await prisma.cV.findFirst({ where: { id, userId: session.user.id } });
  if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cv);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const cv = await prisma.cV.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.template && { template: body.template }),
      ...(body.data && { data: body.data }),
    },
  });
  if (cv.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.cV.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
