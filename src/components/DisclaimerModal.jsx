import React, { useState } from 'react';

export default function DisclaimerModal({ isOpen, onClose }) {
  const [language, setLanguage] = useState('ar');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      backdropFilter: 'blur(6px)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff4444',
        borderRadius: '12px',
        padding: 'clamp(1rem, 4vw, 2rem)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 0 40px rgba(255, 68, 68, 0.25)',
        boxSizing: 'border-box',
        animation: 'disclaimerFadeIn 0.4s ease-out',
      }}>

        {/* Inline keyframes */}
        <style>{`
          @keyframes disclaimerFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Header / Language Switch */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid #333',
          paddingBottom: '0.8rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <h2 style={{
            color: '#ff4444',
            margin: 0,
            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexShrink: 0,
          }}>
            ⚠️ {language === 'ar' ? 'تنبيه وإخلاء مسؤولية' : 'Legal Disclaimer'}
          </h2>

          {/* Language Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#2a2a2a',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #444',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setLanguage('ar')}
              style={{
                padding: '0.35rem 0.9rem',
                border: 'none',
                backgroundColor: language === 'ar' ? '#ff4444' : 'transparent',
                color: language === 'ar' ? '#fff' : '#aaa',
                cursor: 'pointer',
                fontWeight: language === 'ar' ? 'bold' : 'normal',
                fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                transition: 'all 0.25s',
              }}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '0.35rem 0.9rem',
                border: 'none',
                backgroundColor: language === 'en' ? '#ff4444' : 'transparent',
                color: language === 'en' ? '#fff' : '#aaa',
                cursor: 'pointer',
                fontWeight: language === 'en' ? 'bold' : 'normal',
                fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                transition: 'all 0.25s',
              }}
            >
              EN
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          color: '#e0e0e0',
          lineHeight: 1.8,
          fontSize: 'clamp(0.82rem, 3vw, 1rem)',
          textAlign: language === 'ar' ? 'right' : 'left',
          direction: language === 'ar' ? 'rtl' : 'ltr',
          overflowY: 'auto',
          flex: 1,
          paddingRight: language === 'ar' ? '0' : '4px',
          paddingLeft: language === 'ar' ? '4px' : '0',
        }}>
          {language === 'ar' ? (
            <>
              <p style={{ marginBottom: '1rem' }}>
                جميع المشاريع والأنظمة المعروضة على هذا الموقع هي نماذج بحثية لأغراض تعليمية وأكاديمية بحتة، ويتم تطويرها بواسطة فريق Skyhawks تحت إشراف جامعي للمشاركة في المسابقات الهندسية الرسمية.
              </p>
              <p>
                نؤكد التزامنا الكامل بالمدونة القانونية المصرية، وتحديداً القانون رقم 216 لسنة 2017 بشأن تنظيم استخدام الطائرات المحركة آلياً. الفريق لا يقوم بأي أنشطة تصنيع تجاري، استيراد، أو تشغيل ميداني للطائرات إلا بعد الحصول على التصاريح اللازمة من الجهات المعنية (وزارة الدفاع وسلطة الطيران المدني). المواد المنشورة هنا هي لتوثيق الجانب الهندسي والبرمجي فقط.
              </p>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '1rem' }}>
                All projects and autonomous systems showcased on this website are research prototypes developed by the Skyhawks team for educational and academic purposes. These projects are designed specifically for participation in official engineering competitions under academic supervision.
              </p>
              <p>
                We strictly adhere to Egyptian laws, including Law No. 216 of 2017 regarding the regulation of Unmanned Aerial Vehicles (UAVs). Our activities are limited to engineering design and software development. No physical operation or assembly is conducted without explicit authorization from the relevant authorities.
              </p>
            </>
          )}
        </div>

        {/* Footer / Close Button */}
        <div style={{
          marginTop: '1.2rem',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1.2rem, 6vw, 2rem)',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'clamp(0.85rem, 3vw, 1rem)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              width: '100%',
              maxWidth: '280px',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#cc0000'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
          >
            {language === 'ar' ? 'أفهم ذلك' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
}
