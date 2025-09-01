
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import './BookMenu.css';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface BookMenuProps {
  allProducts: Product[];
}

const categories: Product['category'][] = ['Pizza', 'Burgers', 'Fries', 'Beverages', 'Combos', 'Desserts'];

export function BookMenu({ allProducts }: BookMenuProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const productsByCategory = useMemo(() => {
        return categories.reduce((acc, category) => {
            acc[category] = allProducts.filter(p => p.category === category);
            return acc;
        }, {} as Record<string, Product[]>);
    }, [allProducts]);
    
    const handleTabClick = (category: string) => {
        setActiveCategory(prev => prev === category ? null : category);
    };
    
    const handleCoverClick = () => {
        if(activeCategory === null) {
            setActiveCategory(categories[0]);
        }
    }

    const getZIndex = (index: number) => {
        if (activeCategory === null) return categories.length - index;
        const activeIndex = categories.indexOf(activeCategory);
        return categories.length - Math.abs(index - activeIndex);
    };

    const isMobile = isClient && window.innerWidth <= 768;

    if (!isClient) {
        return null;
    }

    return (
        <div className={`book-container ${activeCategory ? 'show-menu' : ''}`}>
            {isMobile ? (
                <div className="w-full">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map(category => (
                             <Button 
                                key={category}
                                onClick={() => handleTabClick(category)}
                                variant={activeCategory === category ? 'default' : 'outline'}
                                className="flex-grow"
                             >
                                 {category}
                             </Button>
                        ))}
                    </div>
                    {activeCategory && (
                        <div className="book-page active-page p-4 bg-card rounded-lg">
                             <h3 className="font-headline text-2xl font-bold mb-4 text-center">{activeCategory}</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {productsByCategory[activeCategory].length > 0 ? (
                                    productsByCategory[activeCategory].map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground col-span-full text-center py-8">No items in this category yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="book">
                    <div className="book-cover" onClick={handleCoverClick}>
                        <div className="book-cover-front">
                            <UtensilsCrossed className="h-24 w-24 text-primary" />
                            <h2 className="font-headline text-5xl font-bold text-center">Our Menu</h2>
                            <p className="text-muted-foreground mt-2">Click to open</p>
                        </div>
                        <div className="book-cover-back">
                           {/* Can add content here for the inside cover */}
                        </div>
                    </div>

                    {categories.map((category, index) => {
                        const isFlipped = activeCategory !== null && categories.indexOf(activeCategory) >= index;
                        const products = productsByCategory[category];

                        return (
                            <div
                                key={category}
                                className={`book-page ${isFlipped ? 'flipped' : ''}`}
                                style={{ zIndex: getZIndex(index), transitionDelay: `${index * 100}ms` }}
                                onClick={() => handleTabClick(category)}
                            >
                                <div className="book-page-content book-page-front">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-headline text-3xl font-bold">{category}</h3>
                                        <div className="flex items-center gap-2 text-primary font-bold cursor-pointer">
                                            <span>Turn Page</span>
                                            <ArrowRight />
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        {products.slice(0, 4).map(p => (
                                            <div key={p.id} className="h-40 relative rounded-lg overflow-hidden">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                                                    <p className="text-white font-bold text-sm">{p.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="book-page-content book-page-back">
                                    <ScrollArea className="h-full pr-4">
                                        <h3 className="font-headline text-3xl font-bold mb-6">{category}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {products.length > 0 ? (
                                                products.map(product => (
                                                    <ProductCard key={product.id} product={product} />
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground col-span-full text-center py-8">No items in this category yet.</p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        );
                    })}

                    <div className="page-tabs">
                        {categories.map((category, index) => (
                             <div 
                                key={category} 
                                className={`page-tab ${activeCategory === category ? 'active' : ''}`} 
                                style={{ transitionDelay: `${(categories.length - index) * 100}ms` }}
                                onClick={() => handleTabClick(category)}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
