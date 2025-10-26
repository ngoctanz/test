"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export default function NextIntlProvider({
  children,
  locale,
  messages,
}: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Asia/Ho_Chi_Minh"
    >
      {children}
    </NextIntlClientProvider>
  );
}
