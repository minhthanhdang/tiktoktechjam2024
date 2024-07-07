"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"

import { Stream } from "@prisma/client"
import { getSelf } from "@/lib/auth-service"


export const updateStream = async (userId: string, data: Partial<Stream>) => {
  try {
    const self = await getSelf()
  } catch {
    throw new Error("Internal Error")
  }
}

