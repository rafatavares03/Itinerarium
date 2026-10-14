import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { validatePassword } from "./utils/password";
import { getUserCredentials } from "./lib/repositories/userRepository";

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt"
  },
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
        console.log("Usuário encontrado:", !!user);
        if(!user) {
          return null;
        }

        const isValid = await validatePassword(password, user.password);
        console.log("Senha válida:", isValid);
        if(!isValid) {
          return null;
        }
         return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          city: user.city_id ?? undefined
        };
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
})