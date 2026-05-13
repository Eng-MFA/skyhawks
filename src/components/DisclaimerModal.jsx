import React, { useState, useEffect } from 'react';

export default function DisclaimerModal({ isOpen, onClose }) {
  const [language, setLanguage] = useState('ar'); // 'ar' or 'en'

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff4444',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 0 30px rgba(255, 68, 68, 0.2)'
      }}>
        {/* Header / Language Switch */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #333',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            color: '#ff4444',
            margin: 0,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚠️ {language === 'ar' ? 'تنبيه وإخلاء مسؤولية' : 'Legal Disclaimer'}
          </h2>
          
          <div style={{
            display: 'flex',
            backgroundColor: '#333',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <button
              onClick={() => setLanguage('ar')}
              style={{
                padding: '0.4rem 1rem',
                border: 'none',
                backgroundColor: language === 'ar' ? '#ff4444' : 'transparent',
                color: language === 'ar' ? '#fff' : '#aaa',
                cursor: 'pointer',
                fontWeight: language === 'ar' ? 'bold' : 'normal',
                transition: 'all 0.3s'
              }}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '0.4rem 1rem',
                border: 'none',
                backgroundColor: language === 'en' ? '#ff4444' : 'transparent',
                color: language === 'en' ? '#fff' : '#aaa',
                cursor: 'pointer',
                fontWeight: language === 'en' ? 'bold' : 'normal',
                transition: 'all 0.3s'
              }}
            >
              EN
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          color: '#e0e0e0',
          lineHeight: 1.8,
          fontSize: '1.05rem',
          textAlign: language === 'ar' ? 'right' : 'left',
          direction: language === 'ar' ? 'rtl' : 'ltr'
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
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#ff4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
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
