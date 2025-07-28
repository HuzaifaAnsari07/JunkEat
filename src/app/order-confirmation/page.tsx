
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PartyPopper, Home } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-[70vh] px-4 py-8">
            <Card className="w-full max-w-lg text-center p-4 md:p-6 shadow-xl bg-card">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <PartyPopper className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Order Confirmed!</CardTitle>
                    <CardDescription className="text-lg">
                        Thank you for your order. Your delicious food is on its way!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        You can expect your delivery in approximately <strong>30-45 minutes.</strong><br/>
                        An email confirmation has been sent to you (not really, this is a demo!).
                    </p>
                    <Separator />
                    <p className="font-headline font-semibold text-xl">What's next?</p>
                    <ul className="text-sm text-muted-foreground list-inside text-left mx-auto max-w-xs space-y-1">
                        <li><span className="font-semibold">Preparation:</span> Your order is being freshly prepared by our chefs.</li>
                        <li><span className="font-semibold">Dispatch:</span> A delivery partner will be assigned shortly.</li>
                        <li><span className="font-semibold">Notification:</span> You'll be notified when it's out for delivery.</li>
                    </ul>
                </CardContent>
                <CardFooter>
                     <Button asChild size="lg" className="w-full font-bold">
                         <Link href="/">
                             <Home className="mr-2 h-5 w-5" />
                             Back to Home
                         </Link>
                     </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
