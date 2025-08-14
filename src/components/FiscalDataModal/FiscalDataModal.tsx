import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FiscalData, FiscalDataModalProps } from '@/types/payment.types';
import { Receipt, Mail, AlertCircle } from 'lucide-react';

// ✅ Упрощенная схема валидации только для email
const fiscalDataSchema = z.object({
  email: z.string().email('Некорректный формат email').min(1, 'Email обязателен'),
  phone: z.string().optional(),
  preferredContact: z.literal('email')
});

type FiscalDataFormValues = z.infer<typeof fiscalDataSchema>;

export const FiscalDataModal: React.FC<FiscalDataModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const form = useForm<FiscalDataFormValues>({
    resolver: zodResolver(fiscalDataSchema),
    defaultValues: {
      email: '',
      phone: '',
      preferredContact: 'email'
    }
  });

  const handleSubmit = (data: FiscalDataFormValues) => {
    // Отправляем только email данные
    const cleanData: FiscalData = {
      preferredContact: 'email',
      email: data.email
    };

    onSubmit(cleanData);
  };

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900/95 border border-gold/40 text-light-cream sm:max-w-md rounded-xl shadow-xl p-6">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-light-cream">
            <Receipt className="h-5 w-5 text-gold" />
            Фискальные данные
          </DialogTitle>
          <DialogDescription className="text-light-cream/80 text-sm leading-relaxed">
            Укажите email или телефон для получения чека. Согласно ФЗ-54 это обязательное требование.
            Указывая данные, вы соглашаетесь с{' '}
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('texex:open-terms');
                window.dispatchEvent(event);
              }}
              className="text-gold underline"
            >
              Условиями сервиса
            </button>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Поле Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-light-cream text-sm">Email адрес</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@domain.com"
                      type="email"
                      disabled={isLoading}
                      {...field}
                      className="border-gold/40 bg-transparent text-white placeholder:text-light-cream/50 focus:border-gold rounded-lg h-9 text-sm"
                    />
                  </FormControl>
                  <FormDescription className="text-light-cream/60 text-xs">
                    Чек будет отправлен на email
                  </FormDescription>
                  <FormMessage className="text-red-300 text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2 pt-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 border-gold/40 bg-slate-800/25 text-light-cream h-9 text-sm"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gold/25 border border-lime-400/60 text-light-cream font-medium h-9 text-sm shadow-lg shadow-lime-400/50"
              >
                {isLoading ? 'Обработка...' : 'Оплатить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};