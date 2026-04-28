import { motion } from "framer-motion";

export function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <motion.svg
        className="absolute w-[200%] h-full top-0 left-0"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
      >
        <path
          d="M0,100 C150,200 250,0 400,100 C550,200 650,0 800,100 L800,0 L0,0 Z"
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="4"
        />
        <path
          d="M0,120 C150,20 250,220 400,120 C550,20 650,220 800,120 L800,0 L0,0 Z"
          fill="url(#grad1)"
          opacity="0.3"
        />
         <path
          d="M0,150 C150,50 250,250 400,150 C550,50 650,250 800,150 L800,0 L0,0 Z"
          fill="url(#grad1)"
          opacity="0.1"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D32F2F" />
            <stop offset="50%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#D32F2F" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
