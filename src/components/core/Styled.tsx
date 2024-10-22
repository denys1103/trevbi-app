import { createStyled } from '@gluestack-style/react';
import { AnimationResolver } from '@gluestack-style/animation-plugin';

export const styled = createStyled([
  new AnimationResolver({
    aliases: {
      ':initial': 'initial',
      ':animate': 'animate',
      ':exit': 'exit',
    },
  }),
]);
