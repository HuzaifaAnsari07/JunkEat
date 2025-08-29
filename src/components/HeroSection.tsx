
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { EllipticalCarousel } from './EllipticalCarousel';
import { motion } from 'framer-motion';

const FloatingIcon = ({ src, className, animationDelay, alt }: { src: string, className: string, animationDelay: string, alt: string }) => (
    <motion.div
        className={`absolute -z-10 ${className}`}
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, -20, 0], opacity: 0.7 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: parseFloat(animationDelay) }}
    >
        <Image src={src} alt={alt} width={80} height={80} className="drop-shadow-lg" />
    </motion.div>
);

export const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * -40;
    const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * -40;

    const carouselImages = [
        '/burger.jpg',
        '/ClassicPepperoni.png',
        '/SpicyBurger.png',
        '/Veggies.png',
        '/Cake.jpg',
        '/margherita.jpg',
    ];

    const foodIcons = [
        { src: '/burger.jpg', className: 'top-[10%] left-[5%]', animationDelay: '0s', alt: 'burger icon' },
        { src: '/Veggies.png', className: 'top-[20%] right-[10%]', animationDelay: '1.5s', alt: 'pizza icon' },
        { src: '/SpicyBurger.png', className: 'bottom-[15%] left-[15%]', animationDelay: '3s', alt: 'burger icon' },
        { src: '/Cake.jpg', className: 'bottom-[10%] right-[20%]', animationDelay: '4.5s', alt: 'cake icon' },
    ];

    return (
        <section
            className="relative w-full h-[90vh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden p-4"
            style={{ perspective: '1000px' }}
        >
            <motion.div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                    translateX: parallaxX,
                    translateY: parallaxY,
                    transformStyle: 'preserve-3d',
                }}
            >
                {foodIcons.map((icon, index) => (
                    <FloatingIcon key={index} {...icon} />
                ))}
            </motion.div>

            <motion.div
                className="relative z-10 text-center flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-md shadow-2xl mb-8">
                    <motion.h1
                        className="font-headline text-5xl md:text-7xl font-extrabold text-gray-800"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                    >
                        <motion.span
                            className="inline-block"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            Cravings
                        </motion.span>
                        {' '}Calling?
                    </motion.h1>
                    <motion.p
                        className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        Get your favorite junk food delivered to your door, faster than you can say "extra cheese".
                    </motion.p>
                </div>
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Button asChild size="lg" className="group relative overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-yellow-500 px-8 py-6 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
                        <Link href="#menu">
                            <span className="absolute inset-0 w-full h-full bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></span>
                            <span className="relative animate-pulse">Order Now</span>
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-0 w-full h-[40vh]">
                <EllipticalCarousel images={carouselImages} />
            </div>
        </section>
    );
};
