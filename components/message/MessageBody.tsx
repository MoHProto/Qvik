import Markdown from 'react-native-markdown-display';
import React, { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

export type MessageBodyProps = {
  markdown: string;
};

export function MessageBody({ markdown }: MessageBodyProps) {
  const { theme } = useUnistyles();
  const mdStyles = useMemo(
    () => ({
      body: {
        color: theme.colors.text,
        fontSize: 15,
        lineHeight: 22,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: theme.spacing[2],
      },
      bullet_list: {
        marginBottom: theme.spacing[2],
      },
      ordered_list: {
        marginBottom: theme.spacing[2],
      },
      link: {
        color: theme.colors.primary,
      },
      code_inline: {
        backgroundColor: theme.colors.border,
        paddingHorizontal: 4,
        borderRadius: 4,
        fontSize: 14,
      },
      fence: {
        backgroundColor: theme.colors.border,
        padding: theme.spacing[2],
        borderRadius: 8,
        marginVertical: theme.spacing[2],
      },
    }),
    [theme],
  );

  return <Markdown style={mdStyles}>{markdown}</Markdown>;
}
