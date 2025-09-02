
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { products } from '@/lib/data';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import './BookMenu.css';
import { ChevronLeft, ChevronRight, BookOpen, Pizza, Ham, Flame, GlassWater, Utensils, Cake } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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

export const BookMenu = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    const { ref: bookRef, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    useEffect(() => {
        if (inView && isClient) {
            const timer = setTimeout(() => setIsBookOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, [inView, isClient]);

    const numPages = productsByCategory.length;

    const handleNextPage = useCallback(() => {
        if (currentPage < numPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, numPages]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);
    
    const handleCategorySelect = (index: number) => {
        if (!isBookOpen) setIsBookOpen(true);
        setCurrentPage(index);
    }
    
    if (!isClient) {
        return null; // Don't render on server
    }

    return (
        <>
            <div className="book-container" ref={bookRef}>
                <div className={cn("book", isBookOpen && "book--open")}>
                    <div className="book__cover">
                        <div className="book__cover-front">
                            <div className="book-title">
                                <Utensils className="h-16 w-16 text-primary-foreground drop-shadow-lg"/>
                                <h3 className="font-headline text-4xl text-primary-foreground">JunkEats</h3>
                                <p className="text-xl text-primary-foreground/80">Full Menu</p>
                            </div>
                            <Button
                                onClick={() => setIsBookOpen(true)}
                                className="mt-8 bg-background/90 text-foreground hover:bg-background"
                            >
                                <BookOpen className="mr-2 h-5 w-5"/>
                                Open Menu
                            </Button>
                        </div>
                        <div className="book__cover-back"></div>
                    </div>

                    <div className="book__pages">
                        {productsByCategory.map((category, i) => (
                            <div 
                                key={category.name} 
                                className="book-page-wrapper"
                                style={{
                                    transform: `rotateY(${-i * 0.5}deg)`,
                                    zIndex: currentPage >= i ? 10 + i : 10 - i,
                                }}
                            >
                                <div 
                                    className="book-page"
                                    style={{
                                        transform: `rotateY(${isBookOpen && currentPage > i ? -160 : 0}deg)`,
                                    }}
                                >
                                    <div className="book-page__front">
                                        <div className="book-page__content">
                                            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                                                <category.icon className="h-24 w-24 mx-auto text-primary opacity-20" />
                                                <h3 className="font-headline text-4xl mt-4">{category.name}</h3>
                                                <p className="text-muted-foreground mt-2">{category.products.length} items</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="book-page__back">
                                        <div className="book-page__content">
                                            <div className="p-2 sm:p-4 h-full overflow-y-auto custom-scrollbar">
                                                <h3 className="font-headline text-2xl font-bold p-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10">{category.name}</h3>
                                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 pt-0">
                                                    {category.products.map(product => (
                                                        <ProductCard key={product.id} product={product} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="book__controls">
                         <Button onClick={handlePrevPage} disabled={currentPage === 0 || !isBookOpen} variant="outline" size="icon" className="rounded-full">
                            <ChevronLeft />
                        </Button>
                        <span className="font-bold text-sm text-muted-foreground w-20 text-center">Page {currentPage + 1} of {numPages}</span>
                        <Button onClick={handleNextPage} disabled={currentPage >= numPages - 1 || !isBookOpen} variant="outline" size="icon" className="rounded-full">
                            <ChevronRight />
                        </Button>
                    </div>

                    <div className="book__tabs">
                        {productsByCategory.map((cat, index) => (
                            <button 
                                key={cat.name} 
                                onClick={() => handleCategorySelect(index)}
                                className={cn(
                                    "book__tab",
                                    currentPage === index && isBookOpen && "book__tab--active"
                                )}
                                style={{ top: `${20 + index * 50}px` }}
                            >
                                <cat.icon className="h-5 w-5" />
                                <span className="tab-text">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mobile-menu-container">
                <Tabs defaultValue={categories[0].name} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
                        {categories.map(category => (
                            <TabsTrigger key={category.name} value={category.name} className="flex-col h-16 gap-1">
                                <category.icon className="h-6 w-6"/>
                                {category.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {productsByCategory.map(category => (
                        <TabsContent key={category.name} value={category.name} className="mobile-content">
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-8">
                                {category.products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </>
    );
};
