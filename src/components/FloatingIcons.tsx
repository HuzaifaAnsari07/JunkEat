
"use client";

import { motion } from 'framer-motion';
import { Pizza, Ham, Flame } from 'lucide-react';
import { useId } from 'react';

const icons = [
    { Icon: Pizza, size: 'w-16 h-16 md:w-24 md:h-24', position: 'top-[10%] left-[10%]', duration: 12, delay: 0 },
    { Icon: Ham, size: 'w-12 h-12 md:w-20 md:h-20', position: 'top-[20%] right-[15%]', duration: 15, delay: 2 },
    { Icon: Flame, size: 'w-10 h-10 md:w-16 md:h-16', position: 'top-[70%] left-[20%]', duration: 18, delay: 4 },
    { Icon: Pizza, size: 'w-8 h-8 md:w-14 md:h-14', position: 'top-[80%] right-[30%]', duration: 10, delay: 1 },
    { Icon: Ham, size: 'w-14 h-14 md:w-22 md:h-22', position: 'top-[40%] left-[35%]', duration: 16, delay: 3 },
    { Icon: Flame, size: 'w-16 h-16 md:w-24 md:h-24', position: 'top-[50%] right-[5%]', duration: 13, delay: 5 },
];

const IconComponent = ({ iconData }: { iconData: typeof icons[0] }) => {
    const { Icon, size, position, duration, delay } = iconData;
    const id = useId();
    
    return (
        <motion.div
            key={id}
            className={`absolute ${position} text-white/70 icon-glow`}
            initial={{ y: -100, opacity: 0 }}
            animate={{
                y: [-20, 20, -20],
                rotate: [0, 15, -15, 0],
                opacity: [0, 0.7, 0],
            }}
            transition={{
                duration: duration,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: delay,
            }}
            whileHover={{ scale: 1.2, rotate: 0 }}
        >
            <Icon className={size} />
        </motion.div>
    );
};


export const FloatingIcons = () => {
    return (
        <div className="absolute inset-0 -z-0">
            {icons.map((iconData, i) => (
                <IconComponent key={i} iconData={iconData} />
            ))}
        </div>
    );
};
