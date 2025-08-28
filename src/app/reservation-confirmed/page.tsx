
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Home, XCircle, Clock, MapPin, QrCode, ClipboardCopy, Check, FileDown, Share2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface OrderDetails {
    id: string;
    tableNumber?: string;
    placementTime: number;
    specialRequests?: string;
    advancePaid?: number;
}

const RESERVATION_DURATION_MS = 60 * 60 * 1000; // 1 hour

function ReservationConfirmedContent() {
    const router = useRouter();
    const { toast } = useToast();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [timeLeft, setTimeLeft] = useState(RESERVATION_DURATION_MS);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const savedOrder = sessionStorage.getItem('latestOrder');
        if (savedOrder) {
            const parsedOrder = JSON.parse(savedOrder);
            if (parsedOrder.orderType === 'dine-in') {
                setOrder(parsedOrder);
            } else {
                router.push('/dashboard');
            }
        } else {
            router.push('/dashboard');
        }
    }, [router]);

    useEffect(() => {
        if (!order) return;

        const interval = setInterval(() => {
            const elapsedTime = Date.now() - order.placementTime;
            const remaining = RESERVATION_DURATION_MS - elapsedTime;
            if (remaining > 0) {
                setTimeLeft(remaining);
            } else {
                setTimeLeft(0);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [order]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

    const handleCancelReservation = () => {
        sessionStorage.removeItem('latestOrder');
        const history = JSON.parse(sessionStorage.getItem('orderHistory') || '[]');
        if (order) {
            const updatedHistory = history.map((o: any) => 
                o.id === order.id ? { ...o, status: 'Cancelled' } : o
            );
            sessionStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
        }

        toast({
            title: "Reservation Cancelled",
            description: `Your booking for Table ${order?.tableNumber} has been cancelled.`,
            variant: 'destructive',
        });
        router.push('/dashboard');
    }
    
    const handleCopyId = () => {
        if (order?.id) {
            navigator.clipboard.writeText(order.id);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    }

    if (!order) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
                <p>Loading your reservation details...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4 py-8">
            <Card className="w-full max-w-lg shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
                <CardHeader className="text-center bg-primary/5 rounded-t-lg">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Clock className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Reservation Confirmed!</CardTitle>
                    <CardDescription>
                        Your table is reserved at JunkEats Express.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                       <p className="text-muted-foreground">Time Remaining</p>
                       <p className="font-mono text-5xl font-bold text-primary">{formatTime(timeLeft)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-muted-foreground">Table Number</p>
                            <p className="font-bold text-lg">T{order.tableNumber}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-muted-foreground">Advance Paid</p>
                           <p className="font-bold text-lg">{formatCurrency(order.advancePaid || 0)}</p>
                        </div>
                    </div>
                     {order.specialRequests && (
                         <div>
                            <p className="font-semibold text-muted-foreground text-sm">Special Requests</p>
                            <p className="text-sm p-2 bg-muted/30 rounded-md">{order.specialRequests}</p>
                        </div>
                     )}

                    <Separator />

                    <div>
                        <p className="font-semibold text-muted-foreground text-sm mb-2">Your Booking ID</p>
                        <div className="flex items-center gap-2">
                           <p className="font-mono text-sm p-2 bg-muted/50 rounded-md flex-grow">{order.id}</p>
                           <Button variant="outline" size="icon" onClick={handleCopyId}>
                               {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                           </Button>
                        </div>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground pt-2">
                        Please show this confirmation at the restaurant. Your table will be held for the duration of the timer.
                    </p>
                </CardContent>
                <CardFooter className="flex-col gap-3 p-6 bg-muted/20 rounded-b-lg">
                    <div className="grid grid-cols-2 gap-2 w-full">
                       <Button asChild className="w-full">
                          <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
                              <MapPin className="mr-2 h-5 w-5" />
                              Get Directions
                          </a>
                       </Button>
                       <Button variant="secondary" className="w-full" onClick={() => alert("Share functionality not implemented.")}>
                          <Share2 className="mr-2 h-5 w-5" />
                          Share
                       </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                         <Button onClick={handleCancelReservation} variant="destructive" className="w-full">
                            <XCircle className="mr-2 h-5 w-5" />
                            Cancel
                        </Button>
                         <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard">
                                <Home className="mr-2 h-5 w-5" />
                                Home
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function ReservationConfirmedPage() {
    return (
        <Suspense fallback={<div className="container mx-auto flex items-center justify-center min-h-[70vh]">Loading...</div>}>
            <ReservationConfirmedContent />
        </Suspense>
    );
}
