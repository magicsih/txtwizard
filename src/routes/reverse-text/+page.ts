import { t } from 'svelte-i18n';


export const load = async () => {
  return {
    title: t('reverse-text')
  };
};
