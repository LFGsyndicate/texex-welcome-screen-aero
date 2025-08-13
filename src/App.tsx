
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PerformanceMonitor from "./components/PerformanceMonitor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TestPay from "./pages/TestPay";
// import { PaymentSuccess } from "./pages/PaymentSuccess";
// import { PaymentError } from "./pages/PaymentError";
// import { PaymentTest } from "./pages/PaymentTest";
// import { PaymentTestSimple } from "./pages/PaymentTestSimple";
import { PaymentSuccessSimple } from "./pages/PaymentSuccessSimple";
import { PaymentErrorSimple } from "./pages/PaymentErrorSimple";
import { TinkoffTest } from "./pages/TinkoffTest";
import { PaymentDebug } from "./pages/PaymentDebug";
import { PaymentTestQuick } from "./pages/PaymentTestQuick";
import { PaymentOnly } from "./pages/PaymentOnly";
import { TinkoffIntegrationTest } from "./pages/TinkoffIntegrationTest";
import { TinkoffScriptTest } from "./pages/TinkoffScriptTest";
import { TinkoffFinalTest } from "./pages/TinkoffFinalTest";
import ComponentTest from "./pages/ComponentTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <ErrorBoundary>
          {/* Убран глобальный VantaBackground для избежания конфликтов с хиро-секцией */}
          <PerformanceMonitor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/testpay" element={<TestPay />} />
              <Route path="/payment/test" element={<TinkoffTest />} />
              <Route path="/payment/debug" element={<PaymentDebug />} />
              <Route path="/payment/quick" element={<PaymentTestQuick />} />
              <Route path="/payment/only" element={<PaymentOnly />} />
              <Route path="/tinkoff/test" element={<TinkoffIntegrationTest />} />
              <Route path="/tinkoff/script" element={<TinkoffScriptTest />} />
              <Route path="/tinkoff/final" element={<TinkoffFinalTest />} />
              <Route path="/component-test" element={<ComponentTest />} />
              <Route path="/payment/success" element={<PaymentSuccessSimple />} />
              <Route path="/payment/error" element={<PaymentErrorSimple />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
