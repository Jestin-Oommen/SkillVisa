import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// ... (existing imports)

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            },
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId,
                },
            },
        });

        if (purchase) {
            return new NextResponse("Already Purchased", { status: 400 });
        }

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                },
            },
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses?.[0]?.emailAddress,
                name: user.firstName!, // Add customer's full name
                address: {
                    line1: '123 Main Street', // Add customer's address details
                    city: 'City',
                    postal_code: '12345',
                    country: 'IN', // Add customer's country code
                },
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', /* Add more countries outside India */],
                
            },
        });

        const newPurchase = await db.purchase.create({
            data:{
                userId: user.id,
                courseId: course.id,
            }
        })

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[COURSES_ID_CHECKOUT]", error);
        return new NextResponse("Internet Error", { status: 500 });
    }
}
