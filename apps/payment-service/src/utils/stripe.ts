import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SCRET_KEY as string, {
    apiVersion: "2025-11-17.clover" as any,
});

export default stripe;