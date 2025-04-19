
import { useNavigate } from 'react-router-dom';
import LanguageSwitch from '@/components/LanguageSwitch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import VantaBackground from '@/components/VantaBackground';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handlePartnerClick = () => {
    window.location.href = 'https://aiix.pro';
  };

  return (
    <>
      <VantaBackground />
      <main className="relative min-h-screen flex flex-col items-center justify-between p-6 text-white">
        <header className="w-full flex justify-between items-center">
          <img 
            src="/lovable-uploads/55ba05a5-2718-4715-9f97-cda517cbf943.png" 
            alt="Texex Logo" 
            className="h-12 md:h-16 object-contain"
          />
          <LanguageSwitch />
        </header>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-shadow">
            {t('title')}
          </h1>
          <Button 
            onClick={handlePartnerClick}
            className="bg-amber-500 hover:bg-amber-400 text-white text-lg py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {t('buttonText')}
          </Button>
        </div>

        <footer className="text-white/70 text-sm md:text-base text-shadow">
          {t('footer')}
        </footer>
      </main>
    </>
  );
};

export default Index;
