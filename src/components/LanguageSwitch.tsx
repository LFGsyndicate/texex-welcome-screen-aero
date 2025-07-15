
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switch flex gap-2 sm:gap-4 text-white/90">
      <span 
        className={`${language === 'ru' ? 'active' : ''} px-2 py-1 min-w-[44px] text-center cursor-pointer transition-all duration-200`}
        onClick={() => setLanguage('ru')}
      >
        ru
      </span>
      <span 
        className={`${language === 'en' ? 'active' : ''} px-2 py-1 min-w-[44px] text-center cursor-pointer transition-all duration-200`}
        onClick={() => setLanguage('en')}
      >
        en
      </span>
    </div>
  );
};

export default LanguageSwitch;
