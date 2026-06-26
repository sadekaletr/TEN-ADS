import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

async function logFailedLogin(identifier: string, provider: string) {
  try {
    await logAudit({
      actorType: "system",
      action: "auth.login_failed",
      entityType: "Auth",
      metadata: { identifier, provider },
    });
  } catch {
    // non-blocking
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "creator",
      name: "Creator",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = credentials.identifier.trim();
        const creator = await prisma.creator.findFirst({
          where: {
            ...notDeleted,
            OR: [{ email: identifier }, { phone: identifier }],
          },
        });
        if (!creator?.password) {
          await logFailedLogin(identifier, "creator");
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          creator.password
        );
        if (!valid) {
          await logFailedLogin(identifier, "creator");
          return null;
        }

        return {
          id: creator.id,
          name: creator.name,
          role: "creator",
          phone: creator.phone,
          email: creator.email ?? undefined,
        };
      },
    }),
    CredentialsProvider({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        if (!admin) {
          await logFailedLogin(credentials.email, "admin");
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          admin.password
        );
        if (!valid) {
          await logFailedLogin(credentials.email, "admin");
          return null;
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        };
      },
    }),
    CredentialsProvider({
      id: "sponsor",
      name: "Sponsor",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const sponsor = await prisma.sponsor.findFirst({
          where: { email: credentials.email, ...notDeleted },
        });
        if (!sponsor?.password) {
          await logFailedLogin(credentials.email, "sponsor");
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          sponsor.password
        );
        if (!valid) {
          await logFailedLogin(credentials.email, "sponsor");
          return null;
        }

        return {
          id: sponsor.id,
          name: sponsor.name,
          email: sponsor.email ?? undefined,
          role: "sponsor",
        };
      },
    }),
    CredentialsProvider({
      id: "agency_admin",
      name: "Agency",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const agency = await prisma.agency.findUnique({
          where: { email: credentials.email },
        });
        if (!agency) {
          await logFailedLogin(credentials.email, "agency_admin");
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          agency.password
        );
        if (!valid) {
          await logFailedLogin(credentials.email, "agency_admin");
          return null;
        }

        return {
          id: agency.id,
          name: agency.name,
          email: agency.email,
          role: "agency_admin",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      const creator = await prisma.creator.findFirst({
        where: { email: user.email, ...notDeleted },
      });
      return Boolean(creator);
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user.email) {
        const creator = await prisma.creator.findFirst({
          where: { email: user.email, ...notDeleted },
        });
        if (creator) {
          token.id = creator.id;
          token.role = "creator";
          token.email = creator.email ?? undefined;
          token.phone = creator.phone;
        }
      }
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.phone = (user as { phone?: string }).phone;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string | undefined;
        session.user.email = token.email as string | undefined;
      }
      return session;
    },
  },
};
