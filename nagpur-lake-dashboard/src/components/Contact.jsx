import { useState } from 'react';
import Navbar from './Navbar';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '100px' }}>
            <Navbar />

            {/* Content */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '50px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                    border: '1px solid #f1f5f9'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{
                            fontSize: '2.8rem',
                            color: '#1e293b',
                            marginBottom: '15px',
                            fontWeight: '800',
                            letterSpacing: '-0.02em'
                        }}>Get in Touch</h2>
                        <p style={{
                            fontSize: '1.2rem',
                            color: '#64748b',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.6
                        }}>
                            Have questions about Nagpur's lakes or want to contribute?
                            We'd love to hear from you.
                        </p>
                    </div>

                    {submitted && (
                        <div style={{
                            background: '#ecfdf5',
                            border: '1px solid #10b981',
                            color: '#065f46',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '30px',
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            ✓ Thank you! Message sent successfully.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="How can we help?"
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                                placeholder="Your message here..."
                            />
                        </div>

                        <button
                            type="submit"
                            style={submitButtonStyle}
                            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
                            onMouseOut={(e) => e.target.style.background = '#2563eb'}
                        >
                            Send Message
                        </button>
                    </form>

                    {/* Contact Information */}
                    <div style={{
                        marginTop: '50px',
                        paddingTop: '30px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px'
                    }}>
                        <div>
                            <h3 style={infoTitleStyle}>Email</h3>
                            <p style={infoTextStyle}>contact@naglakes.com</p>
                        </div>
                        <div>
                            <h3 style={infoTitleStyle}>Phone</h3>
                            <p style={infoTextStyle}>+91 (712) 123-4567</p>
                        </div>
                        <div>
                            <h3 style={infoTitleStyle}>Location</h3>
                            <p style={infoTextStyle}>Nagpur, Maharashtra</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.9rem'
};

const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    outline: 'none',
    background: '#f8fafc'
};

const submitButtonStyle = {
    width: '100%',
    padding: '16px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
};

const infoTitleStyle = {
    color: '#64748b',
    marginBottom: '8px',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const infoTextStyle = {
    color: '#1e293b',
    margin: 0,
    fontWeight: '600',
    fontSize: '1rem'
};
