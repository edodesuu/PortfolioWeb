import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="section-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '2rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', fontWeight: 500 }}>
            {t('footer.copyright')}
          </span>
          <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t('footer.built_with')}
            <span className="animate-pulse-glow" style={{ color: 'rgba(255,255,255,0.25)' }}>墨</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
