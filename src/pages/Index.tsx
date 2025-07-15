
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { t } = useLanguage();

  const handlePartnerClick = () => {
    window.location.href = 'https://aiix.pro';
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 text-white overflow-x-hidden">
      <header className="w-full flex justify-between items-center mb-4 sm:mb-0">
        <img 
          src="/lovable-uploads/55ba05a5-2718-4715-9f97-cda517cbf943.png" 
          alt="Texex Logo" 
          className="h-8 sm:h-12 md:h-16 object-contain"
        />
        <LanguageSwitch />
      </header>

      <div className="text-center max-w-full sm:max-w-3xl mx-auto px-2 sm:px-4">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 text-shadow break-words leading-tight">
          {t('title')}
        </h1>
        <Button 
          onClick={handlePartnerClick}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/50 hover:border-white/70 text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          {t('buttonText')}
        </Button>
      </div>

      <footer className="text-white/70 text-xs sm:text-sm md:text-base text-shadow text-center px-2">
        {t('footer')}
      </footer>
    </main>
  );
};

export default Index;
