import { auth } from "@/lib/auth";
import { getCartSessionId } from "@/lib/cart-session";

export type CartContext = {
  userId: string | null;
  sessionId: string | null;
};

export async function getCartContext(): Promise<CartContext> {
  const [session, sessionId] = await Promise.all([auth(), getCartSessionId()]);
  return {
    userId: session?.user?.id ?? null,
    sessionId,
  };
}

export function getCartWhere(ctx: CartContext) {
  if (ctx.userId) return { user_id: ctx.userId };
  if (ctx.sessionId) return { session_id: ctx.sessionId };
  return null;
}
