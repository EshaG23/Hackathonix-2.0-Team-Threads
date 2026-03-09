import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const FRAME_COUNT = 200;
const SCROLL_HEIGHT_VH = 600;

const LandingPage = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [visibleSections, setVisibleSections] = useState({
        0: false,
        1: false,
        2: false,
        3: false
    });

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = [];
            const promises = [];

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const src = `/animation_frames/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
                img.src = src;
                const promise = new Promise((resolve) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        resolve(null);
                    };
                });
                promises.push(promise);
                loadedImages.push(img);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Scroll and Draw Logic + Viewport Position Detection
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let animationFrameId = null;
        let lastVisibleSections = { ...visibleSections };

        const renderFrame = (index) => {
            const img = images[index];
            if (!img) return;

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvasWidth, canvasHeight);

            const imgAspect = img.width / img.height;
            const canvasAspect = canvasWidth / canvasHeight;
            const zoomFactor = 1.01;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                drawWidth = canvasWidth * zoomFactor;
                drawHeight = (canvasWidth * zoomFactor) / imgAspect;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                drawHeight = canvasHeight * zoomFactor;
                drawWidth = (canvasHeight * zoomFactor) * imgAspect;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = (canvasHeight - drawHeight) / 2;
            }

            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        const updateVisibleSections = () => {
            const viewportHeight = window.innerHeight;
            const topBoundary = viewportHeight * 0.2;
            const bottomBoundary = viewportHeight * 0.8;

            const sectionElements = document.querySelectorAll('[data-section-index]');
            const newVisibleSections = { ...lastVisibleSections };
            let hasChanged = false;

            sectionElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;

                const isInMiddle = elementCenter >= topBoundary && elementCenter <= bottomBoundary;
                const sectionIndex = parseInt(element.dataset.sectionIndex);

                if (newVisibleSections[sectionIndex] !== isInMiddle) {
                    newVisibleSections[sectionIndex] = isInMiddle;
                    hasChanged = true;
                }
            });

            if (hasChanged) {
                lastVisibleSections = newVisibleSections;
                setVisibleSections(newVisibleSections);
            }
        };

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            let progress = scrollTop / docHeight;

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.floor(progress * (FRAME_COUNT - 1))
            );

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                renderFrame(frameIndex);
                updateVisibleSections();
            });
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            handleScroll();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isLoaded, images]);

    return (
        <div style={{ backgroundColor: '#ffffff' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}>
                <canvas ref={canvasRef} style={{ display: 'block', marginLeft: '-10px' }} />
                {!isLoaded && (
                    <div style={loadingOverlayStyle}>
                        <div className="spinner" style={spinnerStyle}></div>
                        <p style={{ marginTop: '1rem', fontWeight: 500 }}>Initializing Nagpur's Lake Portal...</p>
                    </div>
                )}
            </div>

            <div style={{ position: 'relative', width: 'calc(100% - 30px - 10vh)', minHeight: `${SCROLL_HEIGHT_VH}vh`, zIndex: 1, marginLeft: '30px', marginRight: '10vh' }}>
                <Navbar />

                <div style={{ position: 'relative', zIndex: 10, paddingTop: '100px' }}>
                    <Section active={visibleSections[0]} sectionIndex={0}>
                        <h1 style={heroTitleStyle}>Revitalizing Nagpur's Blue Heart</h1>
                        <p style={heroSubStyle}>Scroll to witness the transformation of our city's lifeblood.</p>
                    </Section>

                    <Section active={visibleSections[1]} sectionIndex={1}>
                        <div style={contentBoxStyle}>
                            <h2 style={sectionTitleStyle}>A Heritage to Protect</h2>
                            <p style={sectionTextStyle}>
                                Nagpur's ecological identity is tied to its historic water bodies. From the sprawling <strong>Ambazari Lake</strong>,
                                which has quenched the city's thirst for centuries, to the biodiversity-rich <strong>Gorewada Lake</strong>,
                                these waters are vital sanctuaries for local wildlife and essential lungs for our growing urban landscape.
                            </p>
                        </div>
                    </Section>

                    <Section active={visibleSections[2]} sectionIndex={2}>
                        <div style={contentBoxStyle}>
                            <h2 style={sectionTitleStyle}>Join Public Drives</h2>
                            <p style={sectionTextStyle}>
                                Real change starts with citizen action. Join our community-led cleanup drives to directly impact lake health.
                                We coordinate with local volunteers to remove plastic waste and invasive hyacinth,
                                ensuring these heritage sites remain pristine for future generations.
                            </p>
                            <button onClick={() => navigate('/community-drives')} style={{ ...ctaButtonStyle, marginTop: '20px', background: '#455a64', color: 'white' }}>
                                View Active Drives
                            </button>
                        </div>
                    </Section>

                    <Section active={visibleSections[3]} sectionIndex={3}>
                        <div style={ctaBoxStyle}>
                            <h2 style={sectionTitleStyle}>Explore the Live Dashboard</h2>
                            <p style={sectionTextStyle}>
                                Get real-time insights into pH levels, turbidity, and biodiversity across all major lakes in Nagpur.
                            </p>
                            <button onClick={() => navigate('/dashboard')} style={ctaButtonStyle}>
                                Enter Live Dashboard
                            </button>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

const Section = ({ children, active, sectionIndex }) => (
    <div
        data-section-index={sectionIndex}
        style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: sectionIndex === 0 ? 'center' : 'flex-start',
            paddingLeft: sectionIndex === 0 ? '0' : '40px',
            paddingRight: sectionIndex === 0 ? '0' : '40px',
            maxWidth: sectionIndex === 0 ? '100%' : '900px',
            opacity: active ? 1 : 0.3,
            transform: 'translateY(0)',
            transition: 'opacity 0.6s ease-out',
            pointerEvents: active ? 'auto' : 'none'
        }}>
        {children}
    </div>
);

const loadingOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
};

const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
};

const heroTitleStyle = {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#111827',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const heroSubStyle = {
    fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
    color: '#4b5563',
    textAlign: 'center',
    maxWidth: '800px'
};

const contentBoxStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    padding: '3rem',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    maxWidth: '800px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
};

const ctaBoxStyle = {
    ...contentBoxStyle,
    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(30, 64, 175, 0.9))',
    color: '#fff',
    textAlign: 'center'
};

const sectionTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem'
};

const sectionTextStyle = {
    fontSize: '1.2rem',
    lineHeight: 1.7,
    color: 'inherit'
};

const ctaButtonStyle = {
    marginTop: '2rem',
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: 700,
    background: '#fff',
    color: '#2563eb',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

export default LandingPage;
