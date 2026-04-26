import Markdown, { type RenderRules } from 'react-native-markdown-display';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type MessageBodyProps = {
  markdown: string;
};

function isLastChildInParent(node: any, parent: any) {
  const parentNode = parent?.[0];
  const siblings = parentNode?.children ?? [];
  return siblings.length > 0 && siblings[siblings.length - 1] === node;
}

const markdownRules: RenderRules = {
  paragraph: (node, children, parent, styles) => {
    const isLastChild = isLastChildInParent(node, parent);

    return (
      <View
        key={node.key}
        style={[styles._VIEW_SAFE_paragraph, isLastChild && { marginBottom: 0 }]}
      >
        {children}
      </View>
    );
  },
  bullet_list: (node, children, parent, styles) => {
    const isLastChild = isLastChildInParent(node, parent);
    return (
      <View
        key={node.key}
        style={[styles._VIEW_SAFE_bullet_list, isLastChild && { marginBottom: 0 }]}
      >
        {children}
      </View>
    );
  },
  ordered_list: (node, children, parent, styles) => {
    const isLastChild = isLastChildInParent(node, parent);
    return (
      <View
        key={node.key}
        style={[styles._VIEW_SAFE_ordered_list, isLastChild && { marginBottom: 0 }]}
      >
        {children}
      </View>
    );
  },
  fence: (node, children, parent, styles) => {
    const isLastChild = isLastChildInParent(node, parent);
    return (
      <View key={node.key} style={[styles._VIEW_SAFE_fence, isLastChild && { marginBottom: 0 }]}>
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
        marginTop: 0,
        marginBottom: 0,
      },
      paragraph: {
        marginTop: 0,
        marginBottom: theme.spacing[2],
      },
      bullet_list: {
        marginTop: 0,
        marginBottom: theme.spacing[2],
      },
      ordered_list: {
        marginTop: 0,
        marginBottom: theme.spacing[2],
      },
      list_item: {
        marginBottom: theme.spacing[1],
      },
      link: {
        color: theme.colors.primary,
      },
      heading1: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '800',
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[1],
      },
      heading2: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '750',
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[1],
      },
      heading3: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '700',
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[1],
      },
      heading4: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '650',
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[1],
      },
      heading5: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[1],
      },
      heading6: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[1],
        opacity: 0.9,
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
        marginTop: theme.spacing[2],
        marginBottom: theme.spacing[2],
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
