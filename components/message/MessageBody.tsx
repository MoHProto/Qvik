import Markdown, { type RenderRules } from 'react-native-markdown-display';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type MessageBodyProps = {
  markdown: string;
};

const markdownRules: RenderRules = {
  paragraph: (node, children, parent, styles) => {
    const parentNode = parent[0];
    const siblings = parentNode?.children ?? [];
    const isLastChild = siblings.length > 0 && siblings[siblings.length - 1] === node;

    return (
      <View
        key={node.key}
        style={[styles._VIEW_SAFE_paragraph, isLastChild && { marginBottom: 0 }]}
      >
        {children}
      </View>
    );
  },
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

  return (
    <Markdown rules={markdownRules} style={mdStyles}>
      {markdown}
    </Markdown>
  );
}
