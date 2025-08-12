import { useEffect, useMemo, useState, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { services } from '@/data/services';

const sections = [
  { id: 'hero', label: 'Главная' },
  { id: 'services', label: 'Готовые ИИ' },
  { id: 'cases', label: 'Отзывы' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'faq-payments', label: 'Оплата' },
  { id: 'faq', label: 'FAQ' },
];

const CATEGORY_EVENT = 'texex:set-category';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [desktopListOpen, setDesktopListOpen] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(() => {
    try {
      const cats = Array.from(new Set(services.map(s => s.category)));
      return ['Все', ...cats];
    } catch {
      return ['Все'];
    }
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'categories') {
      setCatOpen(v => !v);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
      return;
    }
    // Особый случай: пункт меню "Оплата" должен вести к разделу "Остались вопросы?" и раскрыть вопрос об оплате
    if (id === 'faq-payments') {
      const faqEl = document.getElementById('faq');
      if (faqEl) {
        faqEl.scrollIntoView({ behavior: 'smooth' });
        // Ждем завершения прокрутки, затем раскрываем аккордеон и прокручиваем к нему
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('texex:open-payment-faq'));
          // Дополнительная прокрутка к раскрытому элементу после анимации
          setTimeout(() => {
            const paymentAccordion = document.getElementById('payment-accordion-item');
            if (paymentAccordion) {
              paymentAccordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }, 800);
      }
      setOpen(false);
      return;
    }
  };

  const selectCategory = (category: string) => {
    window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: category }));
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setCatOpen(false);
  };

  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    if (catOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [catOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-dark-blue/40 border-b border-gold/20">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => scrollTo('hero')} 
            className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
            aria-label="Перейти на главную"
          >
            <img src="/lovable-uploads/55ba05a5-2718-4715-9f97-cda517cbf943.png" alt="Texex" className="h-8" />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className="text-light-cream/90 hover:text-light-cream transition-colors">
              {s.label}
            </button>
          ))}
          <a href="https://aiix.pro" target="_blank" rel="noreferrer" className="liquid-animated-btn px-3 py-1 rounded-full text-light-cream">Наш EN проект</a>
          {/* Desktop: список решений */}
          <Dialog open={desktopListOpen} onOpenChange={setDesktopListOpen}>
            <DialogTrigger asChild>
              <button onClick={() => setDesktopListOpen(true)} className="liquid-outline-btn px-3 py-1 rounded-full text-light-cream flex items-center">
                Список <span className="liquid-caret" />
              </button>
            </DialogTrigger>
            <DialogContent className="liquid-surface-strong border-gold/40 text-light-cream max-w-md">
              <DialogHeader>
                <DialogTitle>Все решения</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-1 rounded-lg liquid-surface-strong" style={{ background: 'rgba(20,39,176,0.43)' }}>
                {services.map(s => (
                  <button key={s.packageId} onClick={(ev) => {
                    ev.preventDefault();
                    setDesktopListOpen(false);
                    requestAnimationFrame(() => {
                      window.dispatchEvent(new CustomEvent('texex:scroll-to-package', { detail: s.packageId }));
                      setOpen(false);
                    });
                  }} className="w-full text-left px-3 py-2 rounded-md liquid-outline-btn hover:bg-light-cream/10 mt-1">
                    {s.packageName}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setCatOpen(v => !v)} className="flex items-center gap-1 text-light-cream/90 hover:text-light-cream">
              Категории <ChevronDown className="w-4 h-4" />
            </button>
            {catOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl liquid-surface-strong p-2" style={{ background: 'rgba(20,39,176,0.43)' }}>
                {categories.map((c, idx) => (
                  <div key={c}>
                    <button onClick={() => selectCategory(c)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-light-cream/10 text-light-cream">
                      {c}
                    </button>
                    {idx < categories.length - 1 && <hr className="liquid-separator my-1" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button className="liquid-button text-light-cream font-bold bg-transparent hover:bg-transparent border-0">Заказать сейчас</Button>
        </div>
                 {/* Mobile: center CTA */}
         <div className="md:hidden flex-1 flex justify-center gap-2">
           <Dialog open={mobileListOpen} onOpenChange={setMobileListOpen}>
            <DialogTrigger asChild>
              <button onClick={() => setMobileListOpen(true)} className="liquid-outline-btn px-3 py-1 h-8 rounded-full text-light-cream flex items-center">
                Список <span className="liquid-caret" />
              </button>
            </DialogTrigger>
            <DialogContent className="liquid-surface-strong border-gold/40 text-light-cream max-w-md">
              <DialogHeader>
                <DialogTitle>Все решения</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-1 rounded-lg liquid-surface-strong" style={{ background: 'rgba(20,39,176,0.43)' }}>
                {services.map(s => (
                  <button key={s.packageId} onClick={(ev) => {
                    ev.preventDefault();
                    setMobileListOpen(false);
                    requestAnimationFrame(() => {
                      window.dispatchEvent(new CustomEvent('texex:scroll-to-package', { detail: s.packageId }));
                      setOpen(false);
                    });
                  }} className="w-full text-left px-3 py-2 rounded-md liquid-outline-btn hover:bg-light-cream/10 mt-1">
                    {s.packageName}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" className="liquid-animated-btn bg-transparent text-light-cream px-3 py-1 h-8 rounded-full hover:bg-transparent active:bg-transparent focus:bg-transparent hover:text-light-cream" onClick={() => setOpen(true)}>Заказ</Button>
        </div>
        <button className="md:hidden text-light-cream" onClick={() => setOpen(v => !v)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold/20 bg-dark-blue/80 backdrop-blur-xl">
          <div className="px-4 py-3 flex flex-col gap-2">
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="text-left px-2 py-2 rounded-lg text-light-cream/90 hover:bg-light-cream/10">
                {s.label}
              </button>
            ))}
            <div className="border-t border-gold/20 my-2" />
            <a href="https://aiix.pro" target="_blank" rel="noreferrer" className="text-left px-2 py-2 rounded-lg text-light-cream/90 hover:bg-light-cream/10">
              Наш EN проект
            </a>
            <div className="border-t border-gold/20 my-2" />
            <div className="px-2" ref={dropdownRef}>
              <button onClick={() => setCatOpen(v => !v)} className="text-left px-2 py-2 rounded-lg text-light-cream/90 hover:bg-light-cream/10 flex items-center justify-between w-full">
                Категории <ChevronDown className="w-4 h-4" />
              </button>
              {catOpen && (
                <div className="grid grid-cols-1 gap-1 py-2">
                  {categories.map((c, idx) => (
                    <div key={c}>
                      <button onClick={() => selectCategory(c)} className="w-full px-3 py-2 rounded-lg liquid-surface-strong text-light-cream text-left" style={{ background: 'rgba(20,39,176,0.43)' }}>
                        {c}
                      </button>
                      {idx < categories.length - 1 && <hr className="liquid-separator my-1" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Modal content for contacts */}
            <div className="mt-3 p-3 rounded-xl liquid-surface">
              <div className="text-center text-light-cream font-semibold uppercase tracking-wide mb-3">СВЯЗАТЬСЯ ДЛЯ ЗАКАЗА СЕЙЧАС</div>
              <div className="grid grid-cols-1 gap-2">
                <a href="https://t.me/ruhunt" target="_blank" rel="noreferrer" className="liquid-animated-btn liquid-btn-telegram rounded-md px-3 py-2 text-light-cream flex items-center gap-3">
                  <span className="liquid-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 4.5L2.5 11l6 2 9-8-6.5 9.5 6 3.5 4.5-13.5z" fill="#55ACEE"/></svg>
                  </span>
                  Telegram
                </a>
                <a href="https://wa.me/79097878786" target="_blank" rel="noreferrer" className="liquid-animated-btn liquid-btn-whatsapp rounded-md px-3 py-2 text-light-cream flex items-center gap-3">
                  <span className="liquid-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 9.6 9.6 0 004.7-1.2l3.3 1-1-3.2A9.6 9.6 0 0022 12 10 10 0 0012 2zm4.7 13.4c-.2.6-1.3 1.1-1.8 1.2-.5.1-1 .1-1.7-.1-1.6-.5-3.5-2-4.3-3.5-.6-1-.8-1.9-.8-2.6 0-.7.4-1.6 1-1.8.3-.1.6-.1.8 0 .2.1.4.6.5.9.1.2.1.4.1.5 0 .2-.2.5-.3.7-.2.2-.3.3-.2.5.1.2.4.9 1 1.5.7.8 1.6 1.4 1.8 1.5.2.1.4.1.6 0 .2-.2.4-.6.6-.8.1-.2.2-.2.4-.1.2.1 1.3.5 1.6.7.2.1.3.2.4.4 0 .1 0 .4-.2.5z" fill="#25D366"/></svg>
                  </span>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 