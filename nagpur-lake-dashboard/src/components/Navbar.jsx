import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={navbarStyle}>
            <div
                onClick={() => navigate('/')}
                style={{ fontWeight: 800, fontSize: '1.6rem', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >

                <span style={{ letterSpacing: '-0.02em' }}>NAGPUR LAKES</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ ...navButtonStyle, color: isActive('/') ? '#2563eb' : '#374151' }}
                >
                    HOME
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ ...navButtonStyle, color: isActive('/dashboard') ? '#2563eb' : '#374151' }}
                >
                    MAP VIEW
                </button>
                <button
                    onClick={() => navigate('/community-drives')}
                    style={{ ...primaryButtonStyle, color: isActive('/community-drives') ? '#2563eb' : '#374151' }}
                >
                    COMMUNITY DRIVES
                </button>
                <button
                    onClick={() => navigate('/partners')}
                    style={{ ...navButtonStyle, color: isActive('/partners') ? '#2563eb' : '#374151' }}
                >
                    PARTNERS
                </button>
                <button
                    onClick={() => navigate('/contact')}
                    style={{ ...navButtonStyle, color: isActive('/contact') ? '#2563eb' : '#374151' }}
                >
                    CONTACT US
                </button>
            </div>
        </nav>
    );
};

const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 5%',
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    boxSizing: 'border-box'
};

const navButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
};

const primaryButtonStyle = {
    ...navButtonStyle,
    background: 'transparent',
    color: '#2563eb',
    padding: '0.5rem 1rem',
    marginLeft: '0.5rem'
};

export default Navbar;
