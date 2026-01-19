
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index";
import { invoices, transactions } from "../db/schema";
import { eq } from "drizzle-orm";

// --- CONFIG ---
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_APP_URL = process.env.NODE_ENV === 'production'
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions"; // Sandbox

export const paymentRoutes = new Hono()
    .post("/invoices", zValidator("json", z.object({
        amount: z.number().min(1000), // Min 1000 IDR
        items: z.array(z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number()
        })),
        userId: z.string() // In real app, get from Context/Session
    })), async (c) => {
        const { amount, items, userId } = c.req.valid("json");
        const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // 1. Create Invoice in DB
        await db.insert(invoices).values({
            id: invoiceId,
            userId,
            amount,
            status: "PENDING",
            items: items
        });

        // 2. Call Midtrans Snap API
        const authString = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");

        try {
            const response = await fetch(MIDTRANS_APP_URL, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${authString}`
                },
                body: JSON.stringify({
                    transaction_details: {
                        order_id: invoiceId,
                        gross_amount: amount
                    },
                    item_details: items,
                    customer_details: {
                        // In real app, fetch user details
                        first_name: "Customer",
                        email: "customer@example.com"
                    }
                })
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("Midtrans Error:", err);
                return c.json({ error: "External Payment Gateway Error" }, 502);
            }

            const data = await response.json();

            // 3. Update Invoice with Snap Token
            await db.update(invoices).set({ snapToken: data.token }).where(eq(invoices.id, invoiceId));

            return c.json({ invoiceId, snapToken: data.token, redirectUrl: data.redirect_url });
        } catch (e) {
            console.error(e);
            return c.json({ error: "Internal Server Error" }, 500);
        }
    })
    .post("/notification", async (c) => {
        // Webhook Handler
        const body = await c.req.json();
        /*
          Midtrans sends:
          {
            "transaction_status": "capture",
            "order_id": "INV-...",
            "fraud_status": "accept",
            "payment_type": "credit_card",
            ...
          }
        */

        const { order_id, transaction_status, fraud_status, payment_type } = body;

        // 1. Log Transaction
        await db.insert(transactions).values({
            orderId: order_id, // Midtrans technically sends transaction_id too, but we key on our OrderID usually or their OrderID depending on flow. Midtrans allows custom OrderID.
            invoiceId: order_id, // We used invoiceId as order_id
            transactionStatus: transaction_status,
            fraudStatus: fraud_status,
            paymentType: payment_type,
            rawResponse: body
        }).onConflictDoUpdate({
            target: transactions.orderId,
            set: {
                transactionStatus: transaction_status,
                fraudStatus: fraud_status,
                rawResponse: body
            }
        });

        // 2. Update Invoice Status
        let newStatus = "PENDING";
        if (transaction_status == "capture") {
            if (fraud_status == "challenge") {
                // Deny/Pending
            } else if (fraud_status == "accept") {
                newStatus = "PAID";
            }
        } else if (transaction_status == "settlement") {
            newStatus = "PAID";
        } else if (transaction_status == "cancel" || transaction_status == "deny" || transaction_status == "expire") {
            newStatus = "FAILED";
        } else if (transaction_status == "pending") {
            newStatus = "PENDING";
        }

        if (newStatus !== "PENDING") {
            await db.update(invoices).set({ status: newStatus as "PENDING" | "PAID" | "FAILED" }).where(eq(invoices.id, order_id));
        }

        return c.json({ status: "ok" });
    });
