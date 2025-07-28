
"use client";

import { useCart } from '@/context/CartProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Landmark, Truck, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const addressSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  zip: z.string().regex(/^\d{5,6}$/, { message: "Must be a valid zip code." }),
  paymentMethod: z.enum(['card', 'upi', 'cod'], { required_error: "You need to select a payment method." }),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      zip: "",
      paymentMethod: "card",
    },
  });

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    console.log("Order placed with values:", values);
    clearCart();
    router.push('/order-confirmation');
  };

  const shippingCost = 5.00;
  const total = cartTotal + shippingCost;

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
            <p>Redirecting to homepage...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
            </Link>
        </Button>
        <h1 className="font-headline text-4xl font-bold text-center mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl><Input placeholder="123 JunkFood Lane" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="city" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl><Input placeholder="Foodville" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="zip" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip Code</FormLabel>
                                            <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                
                                <Separator />

                                <div>
                                    <h3 className="font-headline text-xl mb-4">Payment Method</h3>
                                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Label htmlFor="card" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground">
                                                        <RadioGroupItem value="card" id="card" />
                                                        <CreditCard />
                                                        <span>Credit/Debit Card</span>
                                                    </Label>
                                                    <Label htmlFor="upi" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground">
                                                        <RadioGroupItem value="upi" id="upi" />
                                                        <Landmark />
                                                        <span>UPI</span>
                                                    </Label>
                                                    <Label htmlFor="cod" className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:text-accent-foreground has-[:checked]:border-accent-foreground">
                                                        <RadioGroupItem value="cod" id="cod" />
                                                        <Truck />
                                                        <span>Cash on Delivery</span>
                                                    </Label>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage className="pt-2"/>
                                        </FormItem>
                                    )} />
                                </div>
                                <Button type="submit" size="lg" className="w-full font-bold">Place Order</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle className="font-headline">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint="cart item" />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex-col items-stretch space-y-4">
                        <Separator />
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p className="font-semibold">${cartTotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Shipping</p>
                            <p className="font-semibold">${shippingCost.toFixed(2)}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}
