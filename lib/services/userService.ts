import { User } from "@/types/user";
import { createUser, deleteUser, getCityAdmins } from "../repositories/userRepository";

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

export async function getCityAdminsService(cityId: number) {
  try {
    const res = await getCityAdmins(cityId);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível buscar administradores"
    }
  }
}

export async function deleteUserService(user: User) {
  try {
    await deleteUser(user);
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