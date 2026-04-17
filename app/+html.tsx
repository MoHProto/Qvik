import React, { type PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

import '../unistyles';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

