import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'ar'];
export const defaultLocale = 'en';
 
export default getRequestConfig(async ({locale}) => {
  return {
    messages: (await import(`./src/locales/${locale}.json`)).default
  };
});