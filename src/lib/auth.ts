import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { gql } from "graphql-request";
import { hygraphMutationClient } from "@/lib/hygraph";

const GET_CUSTOMER_BY_EMAIL = gql`
  query GetCustomerByEmail($email: String!) {
    customer(where: { email: $email }, stage: DRAFT) {
      id
      name
      email
      mobile
      passwordHash
    }
  }
`;

interface HygraphCustomer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const data = await hygraphMutationClient.request<{ customer: HygraphCustomer | null }>(
            GET_CUSTOMER_BY_EMAIL,
            { email: credentials.email.toLowerCase().trim() }
          );

          const customer = data.customer;
          if (!customer) return null;

          const valid = await bcrypt.compare(credentials.password, customer.passwordHash);
          if (!valid) return null;

          return { id: customer.id, name: customer.name, email: customer.email, mobile: customer.mobile };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id     = token.id;
        session.user.mobile = token.mobile;
      }
      return session;
    },
  },
};
