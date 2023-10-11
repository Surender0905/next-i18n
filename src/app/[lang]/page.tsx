import LocaleSwitcher from '@/components/locale-switcher';
import { getDictionary } from '@/dictionaries';
import { Locale } from '@/i18n-config';

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  console.log(lang, 'tesr');
  const dictionary = await getDictionary(lang);
  return (
    <main>
      <LocaleSwitcher />
      <p>Current locale: {lang}</p>
      <p>This text is rendered on the server: {dictionary['products'].cart}</p>
    </main>
  );
}
