import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt,  faFileAlt, faUser, faBuilding, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import './BookCard.css';

interface BookCardProps {
  book: {
    "Nr."?: number | string;
    Titulli?: string;
    Autori?: string;
    "Shtepia_Botuese"?: string;
    Cmimi?: string | number;
    "Viti_I_Botimit"?: number | string;
    "Nr_Faqe"?: number | string;
    Kategorizimi?: string;
  };
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div 
      className="book-card"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: '#1e293b',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03)';
      }}
    >
      {/* Decorative accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #ffc107, #ff8f00, #d68910)',
        borderRadius: '20px 20px 0 0'
      }} />

      {/* Title */}
      <h3 style={{
        fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#1e293b',
        lineHeight: '1.3',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        letterSpacing: '-0.025em'
      }}>
        {book.Titulli}
      </h3>

      {/* Author */}
      {book.Autori && book.Autori !== "Jo" && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.95rem',
          color: '#64748b',
          fontWeight: '500'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon icon={faUser} style={{ color: '#6366f1', fontSize: '14px' }} />
          </div>
          <span>{book.Autori}</span>
        </div>
      )}

      {/* Publisher */}
      {book["Shtepia_Botuese"] && book["Shtepia_Botuese"] !== "Jo" && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#64748b',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon icon={faBuilding} style={{ color: '#d97706', fontSize: '12px' }} />
          </div>
          <span>{book["Shtepia_Botuese"]}</span>
        </div>
      )}

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginTop: 'auto',
        padding: '16px 0',
        borderTop: '1px solid #e2e8f0'
      }}>
        {/* Year */}
        {book["Viti_I_Botimit"] && book["Viti_I_Botimit"] !== "Jo" && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#059669', fontSize: '10px' }} />
            </div>
            <span>{book["Viti_I_Botimit"]}</span>
          </div>
        )}

        {/* Pages */}
        {book["Nr_Faqe"] && book["Nr_Faqe"] !== "Jo" && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FontAwesomeIcon icon={faFileAlt} style={{ color: '#be185d', fontSize: '10px' }} />
            </div>
            <span>{book["Nr_Faqe"]} faqe</span>
          </div>
        )}
      </div>

      {/* Price */}
      {book.Cmimi && book.Cmimi !== "Jo" && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#059669',
          background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid #a7f3d0'
        }}>
          <FontAwesomeIcon icon={faMoneyBill} style={{ color: '#059669' }} />
          <span>{book.Cmimi}</span>
        </div>
      )}
    </div>
  );
};

export default BookCard; 