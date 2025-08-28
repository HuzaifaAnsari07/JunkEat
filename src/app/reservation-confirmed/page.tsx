
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface OrderDetails {
    id: string;
    tableNumber?: string;
    placementTime: number;
}

const RESERVATION_DURATION_MS = 60 * 60 * 1000; // 1 hour

function ReservationConfirmedContent() {
    const router = useRouter();
    const { toast } = useToast();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [timeLeft, setTimeLeft] = useState(RESERVATION_DURATION_MS);

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
                // Optionally handle expiry
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

    if (!order) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
                <p>Loading your reservation details...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Clock className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Reservation Confirmed!</CardTitle>
                    <CardDescription>
                        Your Table <span className="font-bold text-primary">T{order.tableNumber}</span> is reserved for the next hour.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="text-muted-foreground">Time Remaining</p>
                        <p className="font-mono text-5xl font-bold text-primary">{formatTime(timeLeft)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground px-4">
                        Please arrive within this time to claim your table. After this time, your reservation will be automatically cancelled.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Button onClick={handleCancelReservation} variant="destructive">
                            <XCircle className="mr-2 h-5 w-5" />
                            Cancel Reservation
                        </Button>
                         <Button asChild>
                            <Link href="/dashboard">
                                <Home className="mr-2 h-5 w-5" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
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

