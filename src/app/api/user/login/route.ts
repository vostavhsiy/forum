import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SHA256 as sha256 } from "crypto-js";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const candidate = await prisma.user.findFirst({
    where: { email: String(email) },
  });
  if (!candidate) {
    return NextResponse.json(
      {
        message: "Пользователя с таким именем не существует",
      },
      { status: 404 },
    );
  }
  const isCompare = sha256(password).toString() === candidate.password;
  if (!isCompare)
    return NextResponse.json({ message: "Неверный пароль" }, { status: 404 });
  const { password: userPass, ...rest } = candidate;
  return NextResponse.json(rest);
}
