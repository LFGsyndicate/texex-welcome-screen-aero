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
                                  <DialogContent className="liquid-surface border-gold/40 text-light-cream max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[95vh] mx-1 tablet:max-w-[90vw] tablet-lg:max-w-[85vw]">
         <DialogHeader className="pb-1">
                     <DialogTitle className="text-light-cream text-center text-lg md:text-xl tablet:text-xl tablet-lg:text-2xl">
            Информация о рассрочке
          </DialogTitle>
         </DialogHeader>
         
                   <div className="space-y-2.5">
                     <p className="text-sm md:text-base text-light-cream/90 leading-relaxed text-center px-0 mb-2.5 tablet:text-base tablet-lg:text-lg">
            Опция рассрочки без процентов и переплат - находится внизу формы оплаты.
          </p>
           
                                                     <div className="flex justify-center">
                            <div className="overflow-auto max-h-[60vh] border border-gold/20 rounded-lg pt-2.5 pb-0 w-full tablet:max-h-[70vh] tablet-lg:max-h-[75vh]">
                     <img 
                       src="/rassrochka.png" 
                       alt="Рассрочка" 
                       className="w-full h-auto rounded-lg"
                       style={{ 
                         minWidth: '83px',
                         maxWidth: '100%',
                         transform: 'scale(0.67)',
                         transformOrigin: 'top center'
                       }}
                       className="w-full h-auto rounded-lg tablet:scale-75 tablet-lg:scale-80"
                     />
                   </div>
             </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
