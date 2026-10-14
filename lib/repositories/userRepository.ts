import prisma from "@/lib/prisma";
import { User } from "@/types/user";

export async function getUserCredentials(email: string) {
  return await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      role: true,
      city_id: true
    },
    where: {
      email: email
    }
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      city_id: true
    },
    where: {
      email: email
    }
  })
}

export async function createUser(user: User) {
  return await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password!,
      role: user.role,
      city_id: user.city
    }
  })
}