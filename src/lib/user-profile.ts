import { db } from "@/lib/db";

export type UserShippingAddress = {
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  shipping_address: UserShippingAddress | null;
};

export function parseShippingAddress(value: unknown): UserShippingAddress | null {
  if (!value || typeof value !== "object") return null;

  const address = value as Record<string, unknown>;
  if (typeof address.line1 !== "string" || typeof address.city !== "string") {
    return null;
  }

  return {
    line1: address.line1,
    line2: typeof address.line2 === "string" ? address.line2 : null,
    city: address.city,
    state: typeof address.state === "string" ? address.state : null,
    postal_code: typeof address.postal_code === "string" ? address.postal_code : "",
    country: typeof address.country === "string" ? address.country : "",
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await db.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      shipping_address: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    shipping_address: parseShippingAddress(user.shipping_address),
  };
}
