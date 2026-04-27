import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { gql } from "graphql-request";
import { hygraphMutationClient } from "@/lib/hygraph";

const GET_CUSTOMER_BY_EMAIL = gql`
  query GetCustomerByEmail($email: String!) {
    customer(where: { email: $email }, stage: DRAFT) { id }
  }
`;

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($name: String!, $email: String!, $mobile: String!, $passwordHash: String!) {
    createCustomer(data: { name: $name, email: $email, mobile: $mobile, passwordHash: $passwordHash }) {
      id name email
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const { name, email, mobile, password } = await req.json();

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate
    const existing = await hygraphMutationClient.request<{ customer: { id: string } | null }>(
      GET_CUSTOMER_BY_EMAIL, { email: normalizedEmail }
    );
    if (existing.customer) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await hygraphMutationClient.request<{ createCustomer: { id: string; name: string; email: string } }>(
      CREATE_CUSTOMER, { name: name.trim(), email: normalizedEmail, mobile: mobile.trim(), passwordHash }
    );

    return NextResponse.json({ success: true, customer: result.createCustomer }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Register API]", msg);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
