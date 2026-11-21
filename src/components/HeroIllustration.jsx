import React from 'react';

const HeroIllustration = () => {
    return (
        <div
            className="hero-illustration-wrapper"
            style={{
                width: '100%',
                maxWidth: '650px',
                margin: '0 auto',
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
                border: '8px solid var(--color-border)'
            }}
        >
            <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200"
                alt="Aptitude Test Planning"
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
        </div>
    );
};

export default HeroIllustration;
