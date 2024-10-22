import { styled } from './Styled';
import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

type HeadingProps = TextProps & {
  children: ReactNode;
};

export const H1: React.FC<HeadingProps> = ({ children, ...props }) => (
  <Text style={styles.h1} {...props}>
    {children}
  </Text>
);

export const H2: React.FC<HeadingProps> = ({ children, ...props }) => (
  <Text style={styles.h2} {...props}>
    {children}
  </Text>
);

export const H3: React.FC<HeadingProps> = ({ children, ...props }) => (
  <Text style={styles.h3} {...props}>
    {children}
  </Text>
);

export const H4: React.FC<HeadingProps> = ({ children, ...props }) => (
  <Text style={styles.h4} {...props}>
    {children}
  </Text>
);

export const H5: React.FC<HeadingProps> = ({ children, ...props }) => (
  <Text style={styles.h5} {...props}>
    {children}
  </Text>
);

export const H6: React.FC<HeadingProps> = ({ children, ...props }) => (
  <Text style={styles.h6} {...props}>
    {children}
  </Text>
);

// Styles for headings
const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 28, fontWeight: 'bold' },
  h3: { fontSize: 24, fontWeight: 'bold' },
  h4: { fontSize: 20, fontWeight: 'bold' }, 
  h5: { fontSize: 16, fontWeight: 'bold' }, 
  h6: { fontSize: 14, fontWeight: 'bold' }, 
});

export default styled(H3, {
  color: '$textDark50',
  letterSpacing: '$sm',
  fontWeight: 'bold',
  fontFamily: '$heading',
  // Overrides expo-html default styling
  marginVertical: 0,
  _dark: {
    color: '$textDark50',
  },
  variants: {
    size: {
      '5xl': {
        //@ts-ignore
        props: { as: H1 },
        fontSize: '$7xl',
        lineHeight: '$7xl',
      },
      '4xl': {
        //@ts-ignore
        props: { as: H1 },
        fontSize: '$5xl',
        lineHeight: '$5xl',
      },

      '3xl': {
        //@ts-ignore
        props: { as: H1 },
        fontSize: '$4xl',
        lineHeight: '$5xl',
      },

      '2xl': {
        //@ts-ignore
        props: { as: H2 },
        fontSize: '$3xl',
        lineHeight: '$3xl',
      },

      xl: {
        //@ts-ignore
        props: { as: H3 },
        fontSize: '$2xl',
        lineHeight: '$3xl',
      },

      lg: {
        //@ts-ignore
        props: { as: H4 },
        fontSize: '$xl',
        lineHeight: '$2xl',
      },

      md: {
        //@ts-ignore
        props: { as: H5 },
        fontSize: '$lg',
        lineHeight: '$md',
      },

      sm: {
        //@ts-ignore
        props: { as: H6 },
        fontSize: '$md',
        lineHeight: '$lg',
      },

      xs: {
        //@ts-ignore
        props: { as: H6 },
        fontSize: '$sm',
        lineHeight: '$xs',
      },
    },
  },

  defaultProps: {
    size: 'lg',
  },
});
