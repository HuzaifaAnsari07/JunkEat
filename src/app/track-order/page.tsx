
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, CookingPot, Bike, Home } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TOTAL_DELIVERY_TIME = 20000; // 20 seconds
const STAGES = [
    { name: "Order Placed", icon: <CheckCircle className="h-8 w-8 text-green-500" />, description: "We have received your order." },
    { name: "Preparing", icon: <CookingPot className="h-8 w-8 text-amber-500" />, description: "Your meal is being prepared by our expert chefs." },
    { name: "Out for Delivery", icon: <Bike className="h-8 w-8 text-blue-500" />, description: "Your order is on its way to you!" },
    { name: "Delivered", icon: <Home className="h-8 w-8 text-primary" />, description: "Enjoy your delicious meal!" }
];
const TIME_PER_STAGE = TOTAL_DELIVERY_TIME / STAGES.length;

export default function TrackOrderPage() {
    const [progress, setProgress] = useState(0);
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const latestOrder = sessionStorage.getItem('latestOrder');
        if (latestOrder) {
            const parsedOrder = JSON.parse(latestOrder);
            setOrderId(parsedOrder.id);
            // Use placement time from the order if available to persist tracking
            if (parsedOrder.placementTime) {
                setStartTime(parsedOrder.placementTime);
            }
        }
    }, []);

    useEffect(() => {
        if (!startTime) return;

        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = Math.min((elapsedTime / TOTAL_DELIVERY_TIME) * 100, 100);
            setProgress(newProgress);

            const newStatusIndex = Math.min(Math.floor(elapsedTime / TIME_PER_STAGE), STAGES.length - 1);
            setCurrentStatusIndex(newStatusIndex);

            if (elapsedTime >= TOTAL_DELIVERY_TIME) {
                clearInterval(interval);
            }
        }, 100); // Update every 100ms for smooth animation

        return () => clearInterval(interval);
    }, [startTime]);

    const estimatedTimeRemaining = Math.max(0, Math.ceil((TOTAL_DELIVERY_TIME - (Date.now() - startTime)) / 1000 / 60));

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
                    <CardDescription>Order #{orderId || '...'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <Progress value={progress} className="h-3 transition-all duration-100 ease-linear" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Placed</span>
                            <span>Preparing</span>
                            <span>On its way</span>
                            <span>Delivered</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {STAGES.map((status, index) => (
                             <div key={index} className={`flex gap-6 items-start transition-opacity duration-500 ${index > currentStatusIndex ? 'opacity-40' : ''}`}>
                                <div className={`flex flex-col items-center gap-2 transition-colors duration-500 ${index <= currentStatusIndex ? 'text-primary' : ''}`}>
                                    <div className={`p-3 rounded-full transition-colors duration-500 ${index <= currentStatusIndex ? 'bg-primary/10' : 'bg-muted'}`}>
                                       {status.icon}
                                    </div>
                                    {index < STAGES.length - 1 && (
                                        <div className={`w-0.5 grow transition-colors duration-500 ${index < currentStatusIndex ? 'bg-primary' : 'bg-border'}`}></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className={`font-headline text-xl font-semibold transition-colors duration-500 ${index > currentStatusIndex ? 'text-muted-foreground' : ''}`}>{status.name}</h3>
                                    <p className="text-muted-foreground">{status.description}</p>
                                    {index === currentStatusIndex && progress < 100 && (
                                        <p className="text-sm text-primary font-bold animate-pulse mt-1">Current Status</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="my-8 h-px bg-border" />
                    
                    <div className="text-center">
                        <p className="text-muted-foreground">Estimated Delivery Time:</p>
                        <p className="font-bold text-xl font-headline">
                             {progress < 100 ? `${estimatedTimeRemaining} minutes` : "Delivered"}
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
