import { NextRequest, NextResponse } from "next/server";
import { hygraphMutationClient } from "@/lib/hygraph";
import { buildCreateOrderMutation, PUBLISH_ORDER } from "@/lib/mutations";
import type { OrderInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: OrderInput = await req.json();
    const { customerName, phone, address, notes, productIds } = body;

    if (!customerName || !phone || !address || !productIds?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create draft order in Hygraph
    const { createOrder } = await hygraphMutationClient.request<{
      createOrder: { id: string; customerName: string };
    }>(buildCreateOrderMutation(productIds), { customerName, phone, address, notes });

    // 2. Publish it so it appears in admin panel immediately
    await hygraphMutationClient.request(PUBLISH_ORDER, { id: createOrder.id });

    return NextResponse.json({ success: true, orderId: createOrder.id }, { status: 201 });
  } catch (err) {
    console.error("[Orders API]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
