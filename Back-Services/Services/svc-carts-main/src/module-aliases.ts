/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import moduleAlias from 'module-alias';

const dirName = __dirname;

/**
 * Used to add aliases to project directories because there's no alias handling on JS
 */
moduleAlias.addAliases({
  '@': `${dirName}`
});
