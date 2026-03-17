import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants & Config ---
const SCENE_DURATIONS = [
  5000, // 0: Core value prop
  6000, // 1: Avatars & Cards
  7000, // 2: Trust & Details
  6000, // 3: Privacy & Lock
  6000, // 4: Outro & Tagline
];

// --- Assets ---
const ASSETS = {
  bg: '/src/assets/images/people-memory-bg.png',
  lock: '/src/assets/images/people-memory-lock.png',
  avatar: '/src/assets/images/people-memory-avatar.png',
};

// --- Easing ---
const EASING = {
  smooth: [0.25, 1, 0.5, 1],
  snappy: [0.16, 1, 0.3, 1],
  slow: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 200, damping: 20 },
  bouncy: { type: "spring", stiffness: 300, damping: 15 }
};

// --- Helper for text staggering ---
const SplitText = ({ text, delayOffset = 0, className = "" }) => {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em]">
          <motion.div
            initial={{ y: "120%", opacity: 0, rotate: 5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: "-120%", opacity: 0, rotate: -5 }}
            transition={{ duration: 0.8, delay: delayOffset + i * 0.1, ease: EASING.smooth }}
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// --- Scenes ---

function Scene0() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: EASING.smooth }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 w-full max-w-5xl">
        <motion.div 
          className="w-16 h-16 rounded-full bg-[#3A7EFF]/20 blur-xl absolute -top-8 -left-8"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <SplitText 
          text="Remember everyone" 
          className="text-5xl md:text-7xl font-bold text-white tracking-tight justify-center" 
          delayOffset={0.2} 
        />
        <SplitText 
          text="you meet." 
          className="text-5xl md:text-7xl font-bold text-[#3A7EFF] tracking-tight mt-2 justify-center" 
          delayOffset={0.5} 
        />
        <motion.p
          className="mt-8 text-xl text-gray-400 font-light max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, delay: 1.2, ease: EASING.smooth }}
        >
          Your personal, private index of the people in your life.
        </motion.p>
      </div>
    </motion.div>
  );
}

function Scene1() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1000); // Card appears
    const t2 = setTimeout(() => setStage(2), 2500); // Details populate
    const t3 = setTimeout(() => setStage(3), 4000); // Floating badges
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-10vw" }}
      transition={{ duration: 1 }}
    >
      <div className="relative w-full h-full flex items-center justify-center perspective-[2000px]">
        
        {/* Main Card */}
        <motion.div
          className="w-[450px] bg-[#121822] rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 relative overflow-hidden"
          initial={{ rotateY: 30, rotateX: 20, z: -500, opacity: 0, scale: 0.8 }}
          animate={{ rotateY: 0, rotateX: 0, z: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: EASING.smooth }}
        >
          {/* Card Bg Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#3A7EFF] rounded-full blur-[100px] opacity-20" />
          
          <div className="flex flex-col items-center">
            <motion.div 
              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#3A7EFF] to-[#121822] p-1 shadow-xl mb-6 relative"
              initial={{ scale: 0 }}
              animate={{ scale: stage >= 1 ? 1 : 0 }}
              transition={EASING.bouncy}
            >
              <div className="w-full h-full bg-[#0d1117] rounded-full overflow-hidden flex items-center justify-center">
                <img src={ASSETS.avatar} alt="Avatar" className="w-[120%] h-[120%] object-cover object-top" />
              </div>
              <motion.div 
                className="absolute bottom-2 right-2 w-8 h-8 bg-[#3A7EFF] rounded-full border-4 border-[#121822] shadow-lg flex items-center justify-center text-white font-bold text-xs"
                initial={{ scale: 0 }} animate={{ scale: stage >= 1 ? 1 : 0 }} transition={{ delay: 0.5, ...EASING.bouncy }}
              >
                ✓
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 10 }}
              transition={{ duration: 0.6 }}
            >
              Alex Mercer
            </motion.h2>
            
            <motion.p 
              className="text-[#3A7EFF] font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Met 2 days ago • Coffee Shop
            </motion.p>
          </div>

          <div className="mt-8 space-y-4">
            <motion.div className="h-12 bg-white/5 rounded-2xl w-full" initial={{ scaleX: 0 }} animate={{ scaleX: stage >= 2 ? 1 : 0 }} transition={{ duration: 0.8, ease: EASING.smooth, originX: 0 }} />
            <motion.div className="h-12 bg-white/5 rounded-2xl w-5/6" initial={{ scaleX: 0 }} animate={{ scaleX: stage >= 2 ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASING.smooth, originX: 0 }} />
          </div>
        </motion.div>

        {/* Floating elements */}
        <AnimatePresence>
          {stage >= 3 && (
            <>
              <motion.div
                className="absolute left-[15%] top-[30%] bg-[#121822] border border-white/10 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
                initial={{ opacity: 0, x: -50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                transition={{ opacity: { duration: 0.6 }, x: { ...EASING.spring }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              >
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">❤️</div>
                <span className="text-white font-medium">Loves Espresso</span>
              </motion.div>

              <motion.div
                className="absolute right-[15%] top-[45%] bg-[#121822] border border-white/10 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                transition={{ delay: 0.2, opacity: { duration: 0.6 }, x: { ...EASING.spring }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">🐕</div>
                <span className="text-white font-medium">Has a Golden Retriever</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
      </div>
    </motion.div>
  );
}

function Scene2() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 2500);
    const t3 = setTimeout(() => setStage(3), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-10vh" }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-6xl px-12 grid grid-cols-2 gap-16 items-center">
        
        {/* Left text */}
        <div>
          <SplitText text="Know who to" className="text-5xl font-bold text-white mb-2" delayOffset={0.2} />
          <SplitText text="trust." className="text-5xl font-bold text-[#3A7EFF] mb-8" delayOffset={0.6} />
          
          <motion.div 
            className="space-y-6 text-xl text-gray-400"
            initial={{ opacity: 0 }} animate={{ opacity: stage >= 1 ? 1 : 0 }} transition={{ duration: 1, delay: 0.8 }}
          >
            <p>Private notes, likes, dislikes.</p>
            <p>Meeting reminders.</p>
            <p>Build deeper connections.</p>
          </motion.div>
        </div>

        {/* Right UI element */}
        <div className="relative">
          <motion.div
            className="w-full bg-[#121822] rounded-[32px] border border-white/10 p-8 shadow-2xl relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: stage >= 1 ? 1 : 0, x: stage >= 1 ? 0 : 50 }}
            transition={{ duration: 1, ease: EASING.smooth }}
          >
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-semibold">Trust Level</h3>
            <div className="h-4 bg-[#0d1117] rounded-full overflow-hidden mb-8">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#3A7EFF] to-cyan-400 relative"
                initial={{ width: "0%" }}
                animate={{ width: stage >= 2 ? "85%" : "0%" }}
                transition={{ duration: 1.5, ease: EASING.smooth }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/30 blur-sm mix-blend-overlay" />
              </motion.div>
            </div>

            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-semibold">Private Notes</h3>
            <div className="space-y-3">
              <motion.div className="bg-[#0d1117] p-4 rounded-xl text-white font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 10 }} transition={{ delay: 0.2 }}>
                Prefers direct communication.
              </motion.div>
              <motion.div className="bg-[#0d1117] p-4 rounded-xl text-white font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 10 }} transition={{ delay: 0.4 }}>
                Follow up about the Tokyo project.
              </motion.div>
            </div>
          </motion.div>

          {/* Background flourish */}
          <motion.div 
            className="absolute -inset-10 border border-[#3A7EFF]/30 rounded-[48px] -z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: stage >= 3 ? 1 : 0.8, opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute -inset-20 border border-[#3A7EFF]/10 rounded-[64px] -z-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: stage >= 3 ? 1 : 0.8, opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Scene3() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1000);
    const t2 = setTimeout(() => setStage(2), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: EASING.smooth }}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="relative w-64 h-64 mb-8 flex items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 50 }}
          transition={{ duration: 1, ease: EASING.smooth }}
        >
          {/* Glowing rings behind lock */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-[#3A7EFF]/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute inset-4 rounded-full border border-[#3A7EFF]/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <img src={ASSETS.lock} alt="Privacy Lock" className="w-48 h-48 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(58,126,255,0.8)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Total Privacy</h2>
          <p className="text-2xl text-[#3A7EFF] font-light">PIN-locked. Local-only. Nothing leaves your phone.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Scene4() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1000);
    const t2 = setTimeout(() => setStage(2), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="relative z-10 flex flex-col items-center">
        
        {/* App Logo/Icon representation */}
        <motion.div
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#3A7EFF] to-blue-800 shadow-[0_0_50px_rgba(58,126,255,0.4)] mb-8 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: stage >= 1 ? 1 : 0, rotate: stage >= 1 ? 0 : -180 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
        >
          <div className="w-10 h-10 border-4 border-white rounded-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full -mt-5" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-white rounded-t-full -mb-1" />
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 20 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          People Memory
        </motion.h1>

        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 2 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <motion.p
            className="text-2xl md:text-3xl text-gray-400 font-light"
            initial={{ y: 40 }}
            animate={{ y: stage >= 2 ? 0 : 40 }}
            transition={{ duration: 0.8, ease: EASING.smooth }}
          >
            Remember everyone. <span className="text-[#3A7EFF] font-semibold">Trust yourself.</span>
          </motion.p>
        </motion.div>

      </div>
    </motion.div>
  );
}

// --- Main Component ---
export default function PeopleMemoryVideo() {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isCancelled = false;

    const scheduleNextScene = (sceneIndex: number) => {
      if (isCancelled) return;
      if (sceneIndex >= SCENE_DURATIONS.length) {
        setCurrentScene(0);
        scheduleNextScene(0);
        return;
      }

      setCurrentScene(sceneIndex);
      timeout = setTimeout(() => {
        scheduleNextScene(sceneIndex + 1);
      }, SCENE_DURATIONS[sceneIndex]);
    };

    scheduleNextScene(0);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#0d1117] font-inter">
      {/* Background layer outside AnimatePresence for continuity */}
      <motion.div
        className="absolute inset-0 opacity-40 mix-blend-lighten pointer-events-none"
        animate={{
          scale: currentScene === 0 ? 1 : currentScene === 4 ? 1.5 : 1.2,
          x: currentScene === 1 ? "-5%" : currentScene === 2 ? "5%" : "0%",
          y: currentScene === 3 ? "5%" : "0%",
          opacity: currentScene === 4 ? 0.1 : 0.4
        }}
        transition={{ duration: 4, ease: EASING.smooth }}
      >
        <img src={ASSETS.bg} alt="" className="w-full h-full object-cover" />
      </motion.div>

      {/* Persistent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/10 via-transparent to-[#0d1117] pointer-events-none z-0" />

      {/* Foreground Scenes */}
      <AnimatePresence mode="wait">
        {currentScene === 0 && <Scene0 key="scene0" />}
        {currentScene === 1 && <Scene1 key="scene1" />}
        {currentScene === 2 && <Scene2 key="scene2" />}
        {currentScene === 3 && <Scene3 key="scene3" />}
        {currentScene === 4 && <Scene4 key="scene4" />}
      </AnimatePresence>
    </div>
  );
}
