import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const GALLERY_IMAGES = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85"
];

function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let imgIndex = 0;
  let r = 0;
  
  while (imgIndex < count) {
    const row = Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = imgIndex;
    imgIndex++;
    
    if (r % 3 === 0 && imgIndex < count) {
      let b = (a + 2) % cols;
      if (b === a) {
        b = (a + 1) % cols;
      }
      row[b] = imgIndex;
      imgIndex++;
    }
    
    rows.push(row);
    r++;
  }
  return rows;
}

export default function App() {
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const blackPanelRef = useRef<HTMLDivElement>(null);
  const innerWrapperRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);
  const outroInfoRef = useRef<HTMLDivElement>(null);
  const outroBuyRef = useRef<HTMLDivElement>(null);
  const outroFooterRef = useRef<HTMLDivElement>(null);
  
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const mainCanvasRef = useRef<HTMLDivElement>(null);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const cursorSvgCircleRef = useRef<SVGCircleElement>(null);
  const leftIndicatorRef = useRef<HTMLDivElement>(null);
  const rightIndicatorRef = useRef<HTMLDivElement>(null);
  const circleSymbolRef = useRef<HTMLSpanElement>(null);
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const staticOffsetsRef = useRef<{ top: number; height: number }[]>([]);
  
  const [colsCount, setColsCount] = useState(4);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [activeTouchVideo, setActiveTouchVideo] = useState<'left' | 'right'>('left');
  const [scrollSpacerHeight, setScrollSpacerHeight] = useState<number | string>('500vh');

  // Live Customizer States
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [logoText, setLogoText] = useState(() => {
    const saved = localStorage.getItem('prmpt_logo');
    if (!saved || saved === 'prmpt') return 'the-fifth';
    return saved;
  });
  const [captionText, setCaptionText] = useState(() => localStorage.getItem('prmpt_caption') || 'When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active.');
  const [navAboutText, setNavAboutText] = useState(() => localStorage.getItem('prmpt_nav_about') || 'ABOUT');
  const [navCartText, setNavCartText] = useState(() => {
    const saved = localStorage.getItem('prmpt_nav_cart');
    if (!saved || saved === '[ CART ]') return '[ 2026 ]';
    return saved;
  });
  const [collectionText, setCollectionText] = useState(() => {
    const saved = localStorage.getItem('prmpt_collection');
    if (!saved || saved === 'ARCHIVE COLLECTION\n"PROMPT"') return 'ARCHIVE COLLECTION\n"THE-FIFTH"';
    return saved;
  });
  const [priceText, setPriceText] = useState(() => localStorage.getItem('prmpt_price') || '$97,33');
  const [viewBtnText, setViewBtnText] = useState(() => {
    const saved = localStorage.getItem('prmpt_view_btn');
    if (!saved || saved === 'view') return '5th Simon';
    return saved;
  });
  const [footerLeftText, setFooterLeftText] = useState(() => {
    const saved = localStorage.getItem('prmpt_footer_left');
    if (!saved || saved === 'PRMPT (R) 2026') return 'THE-FIFTH (R) 2026';
    return saved;
  });
  const [footerRightText, setFooterRightText] = useState(() => localStorage.getItem('prmpt_footer_right') || 'PRIVACY POLICY');
  
  const [leftVideoUrl, setLeftVideoUrl] = useState(() => localStorage.getItem('prmpt_left_video') || 'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4');
  const [rightVideoUrl, setRightVideoUrl] = useState(() => localStorage.getItem('prmpt_right_video') || 'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4');
  
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    const saved = localStorage.getItem('prmpt_gallery_images');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return GALLERY_IMAGES;
  });

  // Automatically trigger video reload when url changes
  useEffect(() => {
    leftLoadedRef.current = false;
    rightLoadedRef.current = false;
    setVideosLoaded(false);
    if (leftVideoRef.current) leftVideoRef.current.load();
    if (rightVideoRef.current) rightVideoRef.current.load();
  }, [leftVideoUrl, rightVideoUrl]);

  // Persistors helper
  const updateCustomVal = (key: string, val: string, setter: (v: string) => void) => {
    setter(val);
    localStorage.setItem(`prmpt_${key}`, val);
  };

  const applyPreset = (presetType: 'default' | 'brutal' | 'neon') => {
    let logo = 'the-fifth';
    let cap = 'When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active.';
    let leftVid = 'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4';
    let rightVid = 'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4';
    let price = '$97,33';
    let coll = 'ARCHIVE COLLECTION\n"THE-FIFTH"';
    let imgs = GALLERY_IMAGES;

    if (presetType === 'brutal') {
      logo = 'b r u t a l';
      cap = 'A structural study of raw geometric form and space. Stripped of ornament. Honesty in concrete, steel, and high-contrast shadow casting.';
      leftVid = 'https://assets.mixkit.co/videos/preview/mixkit-car-headlights-driving-on-a-wet-road-at-night-42358-large.mp4';
      rightVid = 'https://assets.mixkit.co/videos/preview/mixkit-urban-traffic-with-cars-and-buses-at-night-42283-large.mp4';
      price = '$124,00';
      coll = 'BRUTAL STRUCTURES\n"CONCRETE"';
      imgs = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"
      ];
    } else if (presetType === 'neon') {
      logo = 'X - P U L S E';
      cap = 'Synthetic threads woven with liquid electroluminescent fiber optics. Real-time biometric feedback loop displaying spatial temperature mappings.';
      leftVid = 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-woman-with-neon-make-up-41584-large.mp4';
      rightVid = 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-reflected-in-puddle-43391-large.mp4';
      price = '$210,50';
      coll = 'SYNTHETIC FLUX\n"CHROME"';
      imgs = [
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504333631550-3a450db36296?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
      ];
    }

    setLogoText(logo); localStorage.setItem('prmpt_logo', logo);
    setCaptionText(cap); localStorage.setItem('prmpt_caption', cap);
    setLeftVideoUrl(leftVid); localStorage.setItem('prmpt_left_video', leftVid);
    setRightVideoUrl(rightVid); localStorage.setItem('prmpt_right_video', rightVid);
    setPriceText(price); localStorage.setItem('prmpt_price', price);
    setCollectionText(coll); localStorage.setItem('prmpt_collection', coll);
    setGalleryImages(imgs); localStorage.setItem('prmpt_gallery_images', JSON.stringify(imgs));
  };

  const handleReset = () => {
    localStorage.clear();
    setLogoText('the-fifth');
    setCaptionText('When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active.');
    setNavAboutText('ABOUT');
    setNavCartText('[ 2026 ]');
    setCollectionText('ARCHIVE COLLECTION\n"THE-FIFTH"');
    setPriceText('$97,33');
    setViewBtnText('5th Simon');
    setFooterLeftText('THE-FIFTH (R) 2026');
    setFooterRightText('PRIVACY POLICY');
    setLeftVideoUrl('https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4');
    setRightVideoUrl('https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4');
    setGalleryImages(GALLERY_IMAGES);
  };
  
  const leftLoadedRef = useRef(false);
  const rightLoadedRef = useRef(false);
  
  const activeSideRef = useRef<'left' | 'right'>('right');
  const cursorXRef = useRef(0);
  const cursorYRef = useRef(0);
  const scrollYRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastSymbolChangeTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  
  // Track touch vs mouse
  const isTouchRef = useRef(false);

  // Smooth scrubbing & parallax refs
  const leftTimeRef = useRef(0);
  const rightTimeRef = useRef(0);
  const tiltXRef = useRef(0);
  const tiltYRef = useRef(0);
  const translateXRef = useRef(0);
  const translateYRef = useRef(0);
  
  const checkLoaded = (side: 'left' | 'right') => {
    if (side === 'left') leftLoadedRef.current = true;
    if (side === 'right') rightLoadedRef.current = true;
    if (leftLoadedRef.current && rightLoadedRef.current) {
      setVideosLoaded(true);
    }
  };
  
  const handleLeftEnded = () => {
    if (isTouchRef.current) {
      setActiveTouchVideo('right');
      if (rightVideoRef.current) {
        rightVideoRef.current.currentTime = 0;
        rightVideoRef.current.play().catch((err) => console.log('Autoplay blocked:', err));
      }
    }
  };

  const handleRightEnded = () => {
    if (isTouchRef.current) {
      setActiveTouchVideo('left');
      if (leftVideoRef.current) {
        leftVideoRef.current.currentTime = 0;
        leftVideoRef.current.play().catch((err) => console.log('Autoplay blocked:', err));
      }
    }
  };

  // Measure offsets of the cells relative to the inner wrapper container
  const measureOffsets = () => {
    if (innerWrapperRef.current && blackPanelRef.current) {
      const vh = window.innerHeight;
      const wrapScrollHeight = innerWrapperRef.current.scrollHeight;
      const maxScroll = Math.max(0, wrapScrollHeight - vh);
      const totalHeight = vh + maxScroll + 2 * vh;
      setScrollSpacerHeight(totalHeight);
      
      const offsets = cellRefs.current.map((cell) => {
        if (cell) {
          return {
            top: cell.offsetTop,
            height: cell.offsetHeight,
          };
        }
        return { top: 0, height: 0 };
      });
      staticOffsetsRef.current = offsets;
    }
  };

  // Helper to prevent seek jittering
  const updateVideoTime = (video: HTMLVideoElement, targetTime: number) => {
    if (!video || isNaN(targetTime) || !video.duration) return;
    if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime;
    }
  };

  useEffect(() => {
    // 1. Determine columns based on responsive breakpoints
    const updateCols = () => {
      const width = window.innerWidth;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || width < 1024;
      setIsTouchDevice(isTouch);
      isTouchRef.current = isTouch;
      setIsMobile(width < 640);
      
      if (width < 640) {
        setColsCount(2);
      } else if (width < 1024) {
        setColsCount(3);
      } else {
        setColsCount(4);
      }
    };
    
    updateCols();
    window.addEventListener('resize', updateCols);
    
    // Auto-play alternate loop on mobile touch devices
    if (isTouchRef.current) {
      if (leftVideoRef.current) {
        leftVideoRef.current.play().catch((err) => console.log('Autoplay blocked on mount:', err));
      }
    }
    
    // Mouse movement listeners
    const handleMouseMove = (e: MouseEvent) => {
      cursorXRef.current = e.clientX;
      cursorYRef.current = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // 2. Measure offsets once layout settles
    setTimeout(measureOffsets, 200);
    window.addEventListener('resize', measureOffsets);
    
    // 3. Setup RAF main loop
    const tick = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      scrollYRef.current = scrollY;
      
      // Calculate translations
      let panelTranslateY = 0;
      let wrapperTranslateY = 0;
      
      if (scrollY < vh) {
        panelTranslateY = vh - scrollY;
        wrapperTranslateY = 0;
      } else {
        panelTranslateY = 0;
        wrapperTranslateY = -(scrollY - vh);
      }
      
      // Apply translations directly for peak 120fps performance
      if (blackPanelRef.current) {
        blackPanelRef.current.style.transform = `translateY(${panelTranslateY}px)`;
      }
      if (innerWrapperRef.current) {
        innerWrapperRef.current.style.transform = `translateY(${wrapperTranslateY}px)`;
      }
      
      // Hide canvas when fully covered to protect system resources
      if (mainCanvasRef.current) {
        if (scrollY >= vh) {
          mainCanvasRef.current.style.visibility = 'hidden';
        } else {
          mainCanvasRef.current.style.visibility = 'visible';
        }
      }
      
      // Self-heal static offsets if not yet measured correctly
      if (!staticOffsetsRef.current || staticOffsetsRef.current.length === 0 || staticOffsetsRef.current.some(o => o.height === 0)) {
        measureOffsets();
      }
      
      // Card scale calculation
      const offsets = staticOffsetsRef.current;
      if (offsets && offsets.length > 0) {
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
          const offset = offsets[index];
          if (!offset || offset.height === 0) return;
          
          const staticTop = offset.top;
          const height = offset.height;
          
          // Viewport bounding
          const viewportTop = panelTranslateY + wrapperTranslateY + staticTop;
          const viewportBottom = viewportTop + height;
          
          let scale = 0;
          if (viewportBottom <= 0 || viewportTop >= vh) {
            scale = 0;
          } else {
            const enter = Math.min(1, (vh - viewportTop) / (vh * 0.6));
            const exit = Math.min(1, viewportBottom / (vh * 0.4));
            scale = Math.max(0, Math.min(1, Math.min(enter, exit)));
          }
          
          card.style.transform = `scale(${scale})`;
        });
      }
      
      // Outro effects
      if (innerWrapperRef.current) {
        const wrapScrollHeight = innerWrapperRef.current.scrollHeight;
        const maxScroll = Math.max(0, wrapScrollHeight - vh);
        
        if (scrollY > vh + maxScroll) {
          const outroProgress = Math.max(0, Math.min(1, (scrollY - vh - maxScroll) / (vh - 100)));
          
          if (outroOverlayRef.current) {
            outroOverlayRef.current.style.opacity = `${outroProgress}`;
          }
          
          if (outroInfoRef.current) {
            const isTouch = isTouchRef.current;
            const outroOffset = isTouch ? 132 : 166;
            const transY = -(outroOffset * outroProgress);
            outroInfoRef.current.style.transform = `translateY(${transY}px)`;
            outroInfoRef.current.style.opacity = `1`;
          }
          
          if (outroBuyRef.current) {
            outroBuyRef.current.style.transform = `scale(${outroProgress})`;
          }
          
          if (outroFooterRef.current) {
            outroFooterRef.current.style.opacity = `${outroProgress}`;
          }
        } else {
          if (outroOverlayRef.current) {
            outroOverlayRef.current.style.opacity = '0';
          }
          if (outroInfoRef.current) {
            outroInfoRef.current.style.transform = 'translateY(0px)';
          }
          if (outroBuyRef.current) {
            outroBuyRef.current.style.transform = 'scale(0)';
          }
          if (outroFooterRef.current) {
            outroFooterRef.current.style.opacity = '0';
          }
        }
      }
      
      // Symbol randomization on scroll (throttled 80ms)
      if (scrollY !== lastScrollYRef.current) {
        const now = Date.now();
        if (now - lastSymbolChangeTimeRef.current > 80) {
          const symbols = ['8', '$', '^^', '%', '/'];
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          if (circleSymbolRef.current) {
            circleSymbolRef.current.textContent = randomSymbol;
          }
          lastSymbolChangeTimeRef.current = now;
        }
        lastScrollYRef.current = scrollY;
      }
      
      // Desktop custom cursor lag follow and video scrubbing
      if (!isTouchRef.current) {
        if (cursorRef.current) {
          cursorRef.current.style.left = `${cursorXRef.current}px`;
          cursorRef.current.style.top = `${cursorYRef.current}px`;
        }
        
        if (scrollY < vh) {
          const leftVideo = leftVideoRef.current;
          const rightVideo = rightVideoRef.current;
          
          if (leftVideo && rightVideo) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const centerX = width / 2;
            const deadZone = Math.max(30, width * 0.05);
            const leftBoundary = centerX - deadZone;
            const rightBoundary = centerX + deadZone;
            const x = cursorXRef.current;
            const y = cursorYRef.current;
            
            let targetLeftTime = 0;
            let targetRightTime = 0;
            
            // Calculate 3D Parallax Tilt based on mouse cursor coordinates relative to screen center
            const targetTiltX = ((x / width) - 0.5) * 16; // tilt around Y axis (horizontal)
            const targetTiltY = -((y / height) - 0.5) * 16; // tilt around X axis (vertical)
            const targetTranslateX = ((x / width) - 0.5) * -30; // subtle counter translate
            const targetTranslateY = ((y / height) - 0.5) * -30;
            
            tiltXRef.current += (targetTiltX - tiltXRef.current) * 0.08;
            tiltYRef.current += (targetTiltY - tiltYRef.current) * 0.08;
            translateXRef.current += (targetTranslateX - translateXRef.current) * 0.08;
            translateYRef.current += (targetTranslateY - translateYRef.current) * 0.08;
            
            if (mainCanvasRef.current) {
              mainCanvasRef.current.style.transform = `perspective(1000px) rotateX(${tiltYRef.current}deg) rotateY(${tiltXRef.current}deg) translate3d(${translateXRef.current}px, ${translateYRef.current}px, 0) scale(1.06)`;
              mainCanvasRef.current.style.transformStyle = 'preserve-3d';
            }
            
            if (x >= leftBoundary && x <= rightBoundary) {
              leftVideo.style.display = activeSideRef.current === 'left' ? 'block' : 'none';
              rightVideo.style.display = activeSideRef.current === 'right' ? 'block' : 'none';
              targetLeftTime = 0;
              targetRightTime = 0;
              
              if (leftIndicatorRef.current) {
                leftIndicatorRef.current.style.opacity = '0.2';
                leftIndicatorRef.current.style.transform = 'translateY(-50%) rotate(-90deg) scale(1)';
              }
              if (rightIndicatorRef.current) {
                rightIndicatorRef.current.style.opacity = '0.2';
                rightIndicatorRef.current.style.transform = 'translateY(-50%) rotate(90deg) scale(1)';
              }
              if (cursorTextRef.current) {
                cursorTextRef.current.style.opacity = '0';
              }
              if (cursorSvgCircleRef.current) {
                cursorSvgCircleRef.current.style.transform = 'scale(1)';
                cursorSvgCircleRef.current.setAttribute('stroke-width', '2.5');
              }
            } else if (x < leftBoundary) {
              activeSideRef.current = 'right';
              rightVideo.style.display = 'block';
              leftVideo.style.display = 'none';
              
              const distance = leftBoundary - x;
              const progress = Math.max(0, Math.min(1, distance / leftBoundary));
              targetRightTime = progress * (rightVideo.duration || 0);
              targetLeftTime = 0;
              
              if (leftIndicatorRef.current) {
                leftIndicatorRef.current.style.opacity = '1.0';
                leftIndicatorRef.current.style.transform = 'translateY(-50%) rotate(-90deg) scale(1.08)';
              }
              if (rightIndicatorRef.current) {
                rightIndicatorRef.current.style.opacity = '0.08';
                rightIndicatorRef.current.style.transform = 'translateY(-50%) rotate(90deg) scale(0.92)';
              }
              if (cursorTextRef.current) {
                cursorTextRef.current.textContent = `RM-02 / ${(progress * 100).toFixed(0)}%`;
                cursorTextRef.current.style.opacity = '1';
              }
              if (cursorSvgCircleRef.current) {
                cursorSvgCircleRef.current.style.transform = 'scale(1.25)';
                cursorSvgCircleRef.current.setAttribute('stroke-width', '1.5');
              }
            } else {
              activeSideRef.current = 'left';
              leftVideo.style.display = 'block';
              rightVideo.style.display = 'none';
              
              const distance = x - rightBoundary;
              const range = width - rightBoundary;
              const progress = Math.max(0, Math.min(1, distance / range));
              targetLeftTime = progress * (leftVideo.duration || 0);
              targetRightTime = 0;
              
              if (leftIndicatorRef.current) {
                leftIndicatorRef.current.style.opacity = '0.08';
                leftIndicatorRef.current.style.transform = 'translateY(-50%) rotate(-90deg) scale(0.92)';
              }
              if (rightIndicatorRef.current) {
                rightIndicatorRef.current.style.opacity = '1.0';
                rightIndicatorRef.current.style.transform = 'translateY(-50%) rotate(90deg) scale(1.08)';
              }
              if (cursorTextRef.current) {
                cursorTextRef.current.textContent = `RM-01 / ${(progress * 100).toFixed(0)}%`;
                cursorTextRef.current.style.opacity = '1';
              }
              if (cursorSvgCircleRef.current) {
                cursorSvgCircleRef.current.style.transform = 'scale(1.25)';
                cursorSvgCircleRef.current.setAttribute('stroke-width', '1.5');
              }
            }
            
            // Lerp video scrubbing currentTime for organic inertia and liquid-smooth play/rewind swiveling
            leftTimeRef.current += (targetLeftTime - leftTimeRef.current) * 0.12;
            rightTimeRef.current += (targetRightTime - rightTimeRef.current) * 0.12;
            
            updateVideoTime(leftVideo, leftTimeRef.current);
            updateVideoTime(rightVideo, rightTimeRef.current);
          }
        } else {
          // Reset when scrolled past first viewport
          if (leftIndicatorRef.current) leftIndicatorRef.current.style.opacity = '0';
          if (rightIndicatorRef.current) rightIndicatorRef.current.style.opacity = '0';
          if (cursorTextRef.current) cursorTextRef.current.style.opacity = '0';
          if (cursorSvgCircleRef.current) {
            cursorSvgCircleRef.current.style.transform = 'scale(1)';
            cursorSvgCircleRef.current.setAttribute('stroke-width', '2.5');
          }
        }
      }
      
      rafIdRef.current = requestAnimationFrame(tick);
    };
    
    rafIdRef.current = requestAnimationFrame(tick);
    
    return () => {
      window.removeEventListener('resize', updateCols);
      window.removeEventListener('resize', measureOffsets);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const rows = buildLayout(galleryImages.length, colsCount);
  
  // Custom easing matching [0.25, 0.1, 0.25, 1]
  const transitionConfig = {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <div
      id="scroll-spacer"
      ref={scrollSpacerRef}
      className="relative select-none min-h-screen text-white font-sans overflow-x-hidden"
      style={{
        height: scrollSpacerHeight,
        cursor: isTouchDevice ? 'auto' : 'none',
        backgroundColor: '#fff9f9',
      }}
    >
      {/* 1A. Custom Cursor (Desktop Only) */}
       {!isTouchDevice && (
        <>
          {/* Left edge indicator */}
          <div
            ref={leftIndicatorRef}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-exclusion font-mono text-[9px] tracking-[0.25em] uppercase origin-left -rotate-90 transition-all duration-300 opacity-20 whitespace-nowrap"
            style={{ transform: 'translateY(-50%) rotate(-90deg)' }}
          >
            ← RM-02 / SCRUB SIDE B
          </div>

          {/* Right edge indicator */}
          <div
            ref={rightIndicatorRef}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-exclusion font-mono text-[9px] tracking-[0.25em] uppercase origin-right rotate-90 transition-all duration-300 opacity-20 whitespace-nowrap"
            style={{ transform: 'translateY(-50%) rotate(90deg)' }}
          >
            SCRUB SIDE A / RM-01 →
          </div>

          <div
            ref={cursorRef}
            id="custom-cursor"
            className="fixed pointer-events-none z-50 mix-blend-exclusion flex items-center"
            style={{
              width: '48px',
              height: '48px',
              transform: 'translate(-50%, -50%)',
              left: '-100px',
              top: '-100px',
            }}
          >
            <div className="relative w-full h-full">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle
                  ref={cursorSvgCircleRef}
                  cx="24"
                  cy="24"
                  r="22.75"
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  className="transition-transform duration-300 origin-center"
                />
                <path
                  d="M16 18 H32 M24 18 V32 M18 32 H30 M19 25 H29"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                ref={cursorTextRef}
                className="absolute left-[56px] top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.2em] text-white whitespace-nowrap opacity-0 transition-opacity duration-300"
              />
            </div>
          </div>
        </>
      )}

      {/* 1B. Logo (Top Left) */}
      <motion.div
        id="logo-container"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitionConfig}
        className="fixed z-20 pointer-events-none mix-blend-exclusion top-4 left-4 lg:top-8 lg:left-8 flex items-center"
      >
        {logoText.toLowerCase() === 'prmpt' ? (
          <div className="w-[248px] sm:w-[532px] lg:w-[710px]">
            <svg viewBox="0 0 355 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              {/* Letter p */}
              <path d="M10 50 h25 c12 0 22 10 22 20 s-10 20 -22 20 H20 v25 H10 V50zm10 32 h15 c8 0 12 -5 12 -12 s-4 -12 -12 -12 H20 v24z" fill="white" />
              {/* Letter r */}
              <path d="M80 50 h8 v6 c4 -5 10 -8 16 -8 h2 v8 h-3 c-9 0 -13 5 -13 13 v21 h-10 V50z" fill="white" />
              {/* Letter m */}
              <path d="M135 50 h8 v6 c4 -5 10 -8 16 -8 c8 0 14 4 17 9 c4 -5 10 -9 18 -9 c12 0 18 8 18 18 v24 h-10 V60 c0 -9 -5 -12 -12 -12 c-7 0 -12 5 -12 12 v30 h-10 V60 c0 -9 -5 -12 -12 -12 c-7 0 -12 5 -12 12 v30 h-10 V50z" fill="white" />
              {/* Letter p */}
              <path d="M215 50 h25 c12 0 22 10 22 20 s-10 20 -22 20 H225 v25 H215 V50zm10 32 h15 c8 0 12 -5 12 -12 s-4 -12 -12 -12 H225 v24z" fill="white" />
              {/* Letter t */}
              <path d="M285 35 h10 v15 h12 v8 h-12 v22 c0 6 3 8 8 8 h4 v8 h-6 c-10 0 -14 -5 -14 -16 V58 h-8 v-8 h8 V35z" fill="white" />
              {/* Circled R */}
              <path d="M 325 35 c 0 -5 4 -9 9 -9 s 9 4 9 9 s -4 9 -9 9 s -9 -4 -9 -9 z m 2 0 c 0 4 3 7 7 7 s 7 -3 7 -7 s -3 -7 -7 -7 s -7 3 -7 7 z m 3 -4 h4 c 2 0 3 1 3 2 s -1 2 -3 2 h -2 v3 h -2 z m 2 3 h 2 c 0.5 0 1 -0.5 1 -1 s -0.5 -1 -1 -1 h -2 z m 0 1 h 1 l 2 3 h -1.5 l -1.5 -3 z" fill="white" />
            </svg>
          </div>
        ) : (
          <span className="font-sans font-black tracking-[-0.05em] text-[56px] sm:text-[88px] lg:text-[108px] leading-none uppercase select-none text-white">
            {logoText}
            <span className="text-[14px] sm:text-[20px] align-super font-medium ml-1">®</span>
          </span>
        )}
      </motion.div>

      {/* 1C. Caption (Below Logo, Left Side) */}
      <motion.div
        id="caption-container"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitionConfig, delay: 0.3 }}
        className="fixed z-20 pointer-events-none mix-blend-exclusion text-white font-sans font-medium text-[12px] leading-[140%] tracking-[-0.04em] left-4 sm:left-8 top-[160px] sm:top-[280px] lg:top-[400px] w-[calc(100vw-32px)] sm:w-[calc(50vw-48px)] lg:w-[692px]"
      >
        {captionText}
      </motion.div>

      {/* 1D. Header Navigation (Top Right) */}
      <motion.div
        id="nav-container"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitionConfig, delay: 0.15 }}
        className="fixed z-20 pointer-events-none mix-blend-exclusion top-4 right-4 lg:top-8 lg:right-8 flex items-center justify-between h-[30px] w-auto lg:w-[330px]"
      >
        <span className="hidden lg:inline text-white font-sans font-medium text-[15px] tracking-widest uppercase cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity">
          {navAboutText}
        </span>
        <div className="flex items-center gap-5 sm:gap-[50px] lg:gap-[50px]">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 lg:w-[30px] lg:h-[30px] cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity"
          >
            <path d="M0 14H40 M0 26H40" stroke="white" strokeWidth="2.5" />
          </svg>
          <span className="text-white font-sans font-medium text-[13px] lg:text-[15px] uppercase cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity">
            {navCartText}
          </span>
        </div>
      </motion.div>

      {/* 1E. Product Info (Bottom Right) */}
      <motion.div
        id="outro-info"
        ref={outroInfoRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        data-outro-offset={isMobile ? "132" : "166"}
        className="fixed z-20 pointer-events-none mix-blend-exclusion flex flex-col items-center bottom-[48px] left-0 right-0 lg:left-auto lg:right-8 lg:bottom-[80px] lg:w-[330px]"
      >
        <div className="flex flex-col items-center lg:items-start w-[252px] lg:w-full mb-3 lg:mb-8">
          <div className="relative w-5 h-5 lg:w-[30px] lg:h-[30px] flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="absolute inset-0 w-full h-full">
              <circle cx="20" cy="20" r="18.75" stroke="white" strokeWidth={isMobile ? "2" : "2.5"} />
            </svg>
            <span
              id="circle-symbol"
              ref={circleSymbolRef}
              className="font-sans font-medium text-[10px] lg:text-[15px] tracking-[-0.04em] uppercase text-white mt-[1px]"
            >
              8
            </span>
          </div>
          <div className="text-center lg:text-left font-sans font-medium uppercase text-[18px] lg:text-[24px] leading-[110%] tracking-[-0.04em] text-white mt-1 lg:mt-2 whitespace-pre-line">
            {collectionText}
          </div>
        </div>
        <div className="font-sans font-medium text-[60px] lg:text-[80px] leading-[100%] text-center tracking-[-0.04em] text-white">
          {priceText}
        </div>
      </motion.div>

      {/* 1F. "View" Button (Bottom Right, Initially Hidden) */}
      <div
        id="outro-buy"
        ref={outroBuyRef}
        className="fixed z-20 mix-blend-exclusion bg-white rounded-[1335px] flex items-center justify-center transition-transform duration-75 origin-right-bottom bottom-[60px] left-4 right-4 h-[100px] lg:left-auto lg:right-8 lg:bottom-8 lg:w-[330px] lg:h-[174px] cursor-pointer pointer-events-auto"
        style={{
          transform: 'scale(0)',
        }}
        onClick={() => {
          alert(`${logoText} view click / opening archive portal`);
        }}
      >
        <span className="font-sans font-medium text-[72px] lg:text-[110px] tracking-[-0.04em] text-white mix-blend-exclusion leading-none mt-[-4px]">
          {viewBtnText}
        </span>
      </div>

      {/* 1G. Video Container (Hero background) */}
      <div
        id="main-canvas"
        ref={mainCanvasRef}
        className="pointer-events-none transition-opacity duration-300"
        style={{
          position: 'fixed',
          ...(isMobile
            ? { left: 0, top: '220px', width: '100vw', height: 'calc(100vh - 220px)', zIndex: 0 }
            : { inset: 0, width: '100%', height: '100%', zIndex: 0 }),
          opacity: videosLoaded ? 1 : 0,
        }}
      >
        <video
          ref={leftVideoRef}
          src={leftVideoUrl}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            display: isTouchDevice ? (activeTouchVideo === 'left' ? 'block' : 'none') : 'none',
          }}
          onLoadedData={() => checkLoaded('left')}
          onEnded={handleLeftEnded}
        />
        <video
          ref={rightVideoRef}
          src={rightVideoUrl}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            display: isTouchDevice ? (activeTouchVideo === 'right' ? 'block' : 'none') : 'block',
          }}
          onLoadedData={() => checkLoaded('right')}
          onEnded={handleRightEnded}
        />
      </div>

      {/* 1I. White Overlay */}
      <div
        id="outro-overlay"
        ref={outroOverlayRef}
        className="fixed inset-0 pointer-events-none z-12 bg-white transition-opacity duration-75"
        style={{
          opacity: 0,
        }}
      />

      {/* 1J. Footer */}
      <div
        id="outro-footer"
        ref={outroFooterRef}
        className="fixed z-20 pointer-events-none mix-blend-exclusion text-white font-sans font-medium text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase left-4 right-4 lg:right-auto bottom-6 lg:bottom-8 flex items-center justify-between lg:justify-start lg:gap-20 transition-opacity duration-75"
        style={{
          opacity: 0,
        }}
      >
        <span>{footerLeftText}</span>
        <span className="cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity">{footerRightText}</span>
      </div>

      {/* SECTION 2: Black Panel (Gallery) */}
      <div
        id="black-panel"
        ref={blackPanelRef}
        className="fixed inset-0 bg-black z-10 overflow-hidden"
        style={{
          transform: 'translateY(100vh)',
        }}
      >
        <div
          id="inner-wrapper"
          ref={innerWrapperRef}
          className="w-full absolute left-0 top-0 pt-[40vh] pb-32"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-x-12 sm:gap-y-16 lg:gap-x-16 lg:gap-y-24 w-full px-8 md:px-16 lg:px-24">
            {rows.map((row, rowIndex) =>
              row.map((imgIndex, colIndex) => {
                if (imgIndex === -1) {
                  return (
                    <div
                      key={`empty-${rowIndex}-${colIndex}`}
                      className="aspect-[2/3] pointer-events-none"
                    />
                  );
                }
                
                const isLeftHalf = colIndex < colsCount / 2;
                const transformOrigin = isLeftHalf ? 'right bottom' : 'left bottom';
                
                return (
                  <div
                    key={`cell-${imgIndex}`}
                    ref={(el) => {
                      cellRefs.current[imgIndex] = el;
                    }}
                    className="aspect-[2/3] relative"
                  >
                    <div
                      ref={(el) => {
                        cardRefs.current[imgIndex] = el;
                      }}
                      className="bp-card w-full h-full bg-neutral-900 overflow-hidden rounded-md cursor-pointer transition-shadow hover:shadow-2xl duration-300"
                      style={{
                        transformOrigin,
                        transform: 'scale(0)',
                      }}
                    >
                      <img
                        src={galleryImages[imgIndex]}
                        alt={`Archive Product ${imgIndex + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                        onLoad={() => {
                          measureOffsets();
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 2B. Floating Design Customizer Toggle */}
      <div
        className="fixed bottom-4 left-4 z-40 bg-black/85 backdrop-blur-md border border-white/10 text-white rounded-full px-4 py-2.5 flex items-center gap-2.5 font-mono text-[11px] tracking-widest cursor-pointer pointer-events-auto shadow-2xl transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-105 active:scale-95 select-none"
        onClick={() => setShowCustomizer(!showCustomizer)}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        DESIGN PORTAL
      </div>

      {/* 2C. Sliding Design Customizer Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: showCustomizer ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full sm:w-[460px] h-full fixed left-0 top-0 z-50 bg-neutral-950/98 border-r border-white/10 text-white backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto font-mono select-text cursor-default"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold tracking-widest text-white">SYSTEM DESIGN PORTAL</span>
              <span className="text-[9px] text-neutral-400 mt-0.5">LIVE ARCHIVE BUILD CUSTOMIZATION</span>
            </div>
            <button
              onClick={() => setShowCustomizer(false)}
              className="text-[11px] tracking-widest uppercase hover:opacity-80 transition-opacity bg-white/10 hover:bg-white/20 px-3 py-1 rounded border border-white/10"
            >
              [ CLOSE ]
            </button>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <span className="text-[10px] text-neutral-400 tracking-wider block mb-2">QUICK THEMATIC PRESETS:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset('default')}
                className="text-[9px] border border-white/20 py-2 hover:bg-white hover:text-black transition-all rounded uppercase text-center font-bold"
              >
                Avant-Garde
              </button>
              <button
                onClick={() => applyPreset('brutal')}
                className="text-[9px] border border-white/20 py-2 hover:bg-white hover:text-black transition-all rounded uppercase text-center font-bold"
              >
                Brutalist
              </button>
              <button
                onClick={() => applyPreset('neon')}
                className="text-[9px] border border-white/20 py-2 hover:bg-white hover:text-black transition-all rounded uppercase text-center font-bold"
              >
                Chrome Neon
              </button>
            </div>
          </div>

          {/* Form Scroll Container */}
          <div className="space-y-5 text-[11px]">
            {/* Logo Customizer */}
            <div>
              <label className="block text-neutral-400 mb-1.5 uppercase tracking-wider">Brand Name (LOGO):</label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => updateCustomVal('logo', e.target.value, setLogoText)}
                className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. the-fifth"
              />
            </div>

            {/* Videos Customizer */}
            <div className="border-t border-white/5 pt-4">
              <span className="block text-neutral-400 mb-3 uppercase tracking-wider font-bold">Videos (Saturate & Swivel):</span>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-neutral-500 mb-1">Left Scrub Video URL:</label>
                  <input
                    type="text"
                    value={leftVideoUrl}
                    onChange={(e) => updateCustomVal('left_video', e.target.value, setLeftVideoUrl)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-1.5 text-[10px] text-neutral-200 font-mono focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Right Scrub Video URL:</label>
                  <input
                    type="text"
                    value={rightVideoUrl}
                    onChange={(e) => updateCustomVal('right_video', e.target.value, setRightVideoUrl)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-1.5 text-[10px] text-neutral-200 font-mono focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Text Contents */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <span className="block text-neutral-400 mb-1 uppercase tracking-wider font-bold">Text Copywriting:</span>

              <div>
                <label className="block text-neutral-500 mb-1">Main Caption Paragraph:</label>
                <textarea
                  value={captionText}
                  onChange={(e) => updateCustomVal('caption', e.target.value, setCaptionText)}
                  rows={3}
                  className="w-full bg-neutral-900 border border-white/10 rounded px-3 py-2 text-white text-[10px] focus:outline-none focus:border-white transition-colors leading-[140%]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">Collection Title:</label>
                  <textarea
                    value={collectionText}
                    onChange={(e) => updateCustomVal('collection', e.target.value, setCollectionText)}
                    rows={2}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2.5 py-1.5 text-white text-[10px] focus:outline-none focus:border-white transition-colors whitespace-pre-wrap"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Price Tag:</label>
                  <input
                    type="text"
                    value={priceText}
                    onChange={(e) => updateCustomVal('price', e.target.value, setPriceText)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">Nav Link 1:</label>
                  <input
                    type="text"
                    value={navAboutText}
                    onChange={(e) => updateCustomVal('nav_about', e.target.value, setNavAboutText)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Nav Link 2:</label>
                  <input
                    type="text"
                    value={navCartText}
                    onChange={(e) => updateCustomVal('nav_cart', e.target.value, setNavCartText)}
                    className="w-full bg-neutral-900 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Images Section */}
            <div className="border-t border-white/5 pt-4">
              <span className="block text-neutral-400 mb-2 uppercase tracking-wider font-bold">Image Gallery (10 items):</span>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-[9px] text-neutral-500 w-4">#{idx+1}</span>
                    <img src={img} className="w-8 h-8 object-cover rounded bg-neutral-900 border border-white/10" referrerPolicy="no-referrer" />
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const next = [...galleryImages];
                        next[idx] = e.target.value;
                        setGalleryImages(next);
                        localStorage.setItem('prmpt_gallery_images', JSON.stringify(next));
                      }}
                      className="flex-1 bg-neutral-900 border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-neutral-300 focus:outline-none focus:border-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-4 mt-6 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 transition-all duration-300 rounded py-2 text-[10px] tracking-widest uppercase text-center font-bold"
          >
            [ RESET DEFAULTS ]
          </button>
        </div>
      </motion.div>
    </div>
  );
}
