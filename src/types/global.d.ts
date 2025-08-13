// Глобальные типы для приложения

declare global {
  interface Window {
    tinkoffPayRow?: (params: {
      terminalkey: string;
      amount: number;
      order: string;
      description: string;
      name?: string;
      successURL?: string;
      failURL?: string;
      language?: string;
      frame?: boolean;
      container?: HTMLElement;
      success?: () => void;
      error?: (error: any) => void;
      close?: () => void;
    }) => void;
  }
}

export {};