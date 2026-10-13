import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword, validatePassword } from "./utils/password";
import { getUserByEmail, getUserCredentials } from "./lib/repositories/userRepository";

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {type: "password"}
      },
      authorize: async(credentials) => {
        const {email, password} = credentials
        if(typeof email !== "string" || typeof password !== "string") return null;

        const user = await getUserCredentials(email);
        if(!user) {
          throw new Error("Credenciais inválidas.");
        }

        const isValid = await validatePassword(password, user.password);
        
        if(!isValid) {
          return null;
        }
        return user;
      }
    })
  ],
})