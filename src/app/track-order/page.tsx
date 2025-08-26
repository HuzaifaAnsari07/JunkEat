
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, CookingPot, Bike, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const orderStatuses = [
    { name: "Order Placed", icon: <CheckCircle className="h-8 w-8 text-green-500" />, description: "We have received your order." },
    { name: "Preparing", icon: <CookingPot className="h-8 w-8 text-amber-500" />, description: "Your meal is being prepared by our expert chefs." },
    { name: "Out for Delivery", icon: <Bike className="h-8 w-8 text-blue-500" />, description: "Your order is on its way to you!" },
    { name: "Delivered", icon: <Home className="h-8 w-8 text-primary" />, description: "Enjoy your delicious meal!" }
];

export default function TrackOrderPage() {
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex(prevIndex => {
                if (prevIndex < orderStatuses.length - 1) {
                    return prevIndex + 1;
                }
                clearInterval(interval);
                return prevIndex;
            });
        }, 5000); // Update status every 5 seconds

        return () => clearInterval(interval);
    }, []);
    
    const progressPercentage = ((statusIndex + 1) / orderStatuses.length) * 100;

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="outline" asChild className="mb-6">
                <Link href="/order-confirmation">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Order
                </Link>
            </Button>
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Track Your Order</CardTitle>
                    <CardDescription>Order #JNK-{(Math.random() * 10000).toFixed(0)}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <Progress value={progressPercentage} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Placed</span>
                            <span>Preparing</span>
                            <span>On its way</span>
                            <span>Delivered</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {orderStatuses.map((status, index) => (
                             <div key={index} className={`flex gap-6 items-start animate-in fade-in duration-500 ${index > statusIndex ? 'opacity-40' : ''}`}>
                                <div className={`flex flex-col items-center gap-2 ${index > statusIndex ? '' : 'text-primary'}`}>
                                    <div className={`p-3 rounded-full ${index <= statusIndex ? 'bg-primary/10' : 'bg-muted'}`}>
                                       {status.icon}
                                    </div>
                                    {index < orderStatuses.length - 1 && (
                                        <div className={`w-0.5 grow ${index < statusIndex ? 'bg-primary' : 'bg-border'}`}></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className={`font-headline text-xl font-semibold ${index > statusIndex ? 'text-muted-foreground' : ''}`}>{status.name}</h3>
                                    <p className="text-muted-foreground">{status.description}</p>
                                    {index === statusIndex && (
                                        <p className="text-sm text-primary font-bold animate-pulse mt-1">Current Status</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-8" />
                    
                    <div className="text-center">
                        <p className="text-muted-foreground">Estimated Delivery Time:</p>
                        <p className="font-bold text-xl font-headline">10-15 minutes</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
