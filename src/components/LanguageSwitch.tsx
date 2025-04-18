
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switch flex gap-4 text-white/90">
      <span 
        className={language === 'ru' ? 'active' : ''}
        onClick={() => setLanguage('ru')}
      >
        ru
      </span>
      <span 
        className={language === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
      >
        en
      </span>
    </div>
  );
};

export default LanguageSwitch;
