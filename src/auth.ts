import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/connectDB";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

      async authorize(credentials, request) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }
        await connectDB();
        const user = await userModel.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with the provided email.");
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          role: user.role,
          email: user.email,
        };
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        let existingUser = await userModel.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await userModel.create({
            name: user.name,
            email: user.email,
          });
        }

        user.id = existingUser._id.toString();
        user.role = existingUser.role;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
});
