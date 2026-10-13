import { User } from "@/types/user";
import { createUser } from "../repositories/userRepository";

export async function createUserService(user: User) {
  try {
    await createUser(user);
    return {
      success: true
    }
  } catch(e) {
    console.log(e);
    return {
      success: false
    }
  }
}