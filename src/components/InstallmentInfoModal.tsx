import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InstallmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallmentInfoModal: React.FC<InstallmentInfoModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="liquid-surface border-gold/40 text-light-cream w-[95vw] max-w-4xl max-h-[95vh] mx-auto p-4 md:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-light-cream text-center text-xl md:text-2xl font-bold">
            Информация о рассрочке
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-base md:text-lg text-light-cream/90 leading-relaxed text-center">
            Опция рассрочки без процентов и переплат - находится внизу формы оплаты.
          </p>
           
          <div className="flex justify-center">
            <div className="overflow-auto max-h-[70vh] md:max-h-[75vh] border border-gold/30 rounded-xl bg-white/5 p-2">
              <img
                src="/rassrochka.png"
                alt="Инструкция по оформлению рассрочки - скриншот формы оплаты"
                className="w-full h-auto rounded-lg cursor-zoom-in hover:scale-105 transition-transform duration-300"
                style={{
                  minWidth: '300px',
                  maxWidth: '100%'
                }}
                onClick={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.style.transform === 'scale(1.5)') {
                    img.style.transform = 'scale(1)';
                    img.style.cursor = 'zoom-in';
                  } else {
                    img.style.transform = 'scale(1.5)';
                    img.style.cursor = 'zoom-out';
                  }
                }}
              />
            </div>
          </div>
          
          <p className="text-sm text-light-cream/70 text-center italic">
            💡 Нажмите на изображение для увеличения
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
