
'use client';

import { products } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Percent, Pizza, Ham, Flame, GlassWater, Utensils, Cake } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import Link from 'next/link';
import { EllipticalCarousel } from '@/components/EllipticalCarousel';
import AnimatedHeading from '@/components/AnimatedHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';

const categories: { name: Product['category'], icon: React.ElementType }[] = [
    { name: 'Pizza', icon: Pizza },
    { name: 'Burgers', icon: Ham },
    { name: 'Fries', icon: Flame },
    { name: 'Beverages', icon: GlassWater },
    { name: 'Combos', icon: Utensils },
    { name: 'Desserts', icon: Cake },
];

const productsByCategory = categories.map(category => ({
    ...category,
    products: products.filter(p => p.category === category.name),
}));

export default function Home() {
  const bestsellers = products.filter(p => p.bestseller);
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <section id="hero" className="text-center">
        <AnimatedHeading 
            text="Cravings Calling?"
            subtext="Get your favorite junk food delivered to your door, faster than you can say 'extra cheese'."
        />
        <div className="mt-8">
            <EllipticalCarousel />
        </div>
      </section>

      <section id="bestsellers">
        <h2 className="font-headline text-4xl font-bold text-center mb-8">Our Bestsellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map(product => (
            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 relative h-48 w-full">
                <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.id === 6 ? 'spicy burger' : product.id === 1 ? 'cheeseburger' : `${product.name.split(' ')[0]} ${product.category.slice(0, -1)}`} />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4 h-10">{product.description.substring(0, 80)}...</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-primary">{formatCurrency(product.price)}</p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href={`/product/${product.id}`}>View Item</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="offers" className="bg-secondary p-8 rounded-2xl">
         <h2 className="font-headline text-4xl font-bold text-center mb-8">Special Offers</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-md flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Percent className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold">50% OFF on Pizzas</h3>
                <p className="text-muted-foreground">Use code: <span className="font-bold text-primary">PIZZA50</span></p>              </div>
            </div>
             <div className="bg-background p-6 rounded-lg shadow-md flex items-center gap-4">
              <div className="bg-accent/20 p-4 rounded-full">
                <Medal className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold">Burger + Fries Combo</h3>
                <p className="text-muted-foreground">Only for <span className="font-bold text-primary">{formatCurrency(199.00)}</span></p>
              </div>
            </div>
         </div>
      </section>

      <section id="ai-assistant">
        <AIAssistant />
      </section>

      <section id="menu" className="relative py-12 bg-gradient-to-br from-background via-secondary/50 to-background rounded-2xl overflow-hidden">
         <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
         <div className="relative">
            <h2 className="font-headline text-4xl font-bold text-center mb-12">Our Full Menu</h2>
             <Tabs defaultValue={categories[0].name} className="w-full max-w-6xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1.5">
                    {categories.map(category => (
                        <TabsTrigger key={category.name} value={category.name} className="flex-col h-16 gap-1 text-xs sm:text-sm">
                            <category.icon className="h-6 w-6 mb-1"/>
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {productsByCategory.map(category => (
                    <TabsContent key={category.name} value={category.name} className="animate-in fade-in-50 duration-500">
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 pt-8">
                            {category.products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
         </div>
      </section>
    </div>
  );
}
