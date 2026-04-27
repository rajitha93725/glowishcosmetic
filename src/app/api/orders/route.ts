import { NextRequest, NextResponse } from "next/server";
import { hygraphMutationClient } from "@/lib/hygraph";
import { CREATE_ORDER, PUBLISH_ORDER } from "@/lib/mutations";
import type { OrderInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: OrderInput = await req.json();
    const { customerName, phone, address, notes, productIds, customerEmail, discountApplied } = body;

    if (!customerName || !phone || !address || !productIds?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const uniqueProductIds = Array.from(new Set(productIds)).map((id) => ({ id }));

    console.log("[Orders API] Creating order:", { customerName, phone, address, productIds: uniqueProductIds });

    // 1. Create draft order in Hygraph
    let createOrder: { id: string; customerName: string };
    try {
      const result = await hygraphMutationClient.request<{
        createOrder: { id: string; customerName: string };
      }>(CREATE_ORDER, {
        customerName,
        phone,
        address,
        notes,
        productIds: uniqueProductIds,
        customerEmail: customerEmail ?? null,
        discountApplied: discountApplied ?? null,
      });
      createOrder = result.createOrder;
      console.log("[Orders API] Order created:", createOrder.id);
    } catch (createErr: unknown) {
      const msg = createErr instanceof Error ? createErr.message : String(createErr);
      console.error("[Orders API] createOrder failed:", msg);
      return NextResponse.json({ error: "Failed to create order", detail: msg }, { status: 500 });
    }

    // 2. Publish the order (non-blocking — order is created even if publish fails)
    try {
      await hygraphMutationClient.request(PUBLISH_ORDER, { id: createOrder.id });
      console.log("[Orders API] Order published:", createOrder.id);
    } catch (publishErr: unknown) {
      const msg = publishErr instanceof Error ? publishErr.message : String(publishErr);
      console.error("[Orders API] publishOrder failed (order still created):", msg);
    }

    return NextResponse.json({ success: true, orderId: createOrder.id }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Orders API] Unexpected error:", msg);
    return NextResponse.json({ error: "Failed to create order", detail: msg }, { status: 500 });
  }
}
