import vi from '~/locales/vi'
import en from '~/locales/en'

const translations = { vi, en }

export const useTranslate = () => {
  const locale = useState<'vi' | 'en'>('locale', () => 'vi')

  const t = (key: string): string => {
    const trans = translations[locale.value]
    return (trans as any)[key] || key
  }

  const setLocale = (lang: 'vi' | 'en') => {
    locale.value = lang
    if (process.client) {
      localStorage.setItem('locale', lang)
    }
  }

  // Load locale from localStorage on mount
  if (process.client) {
    onMounted(() => {
      const saved = localStorage.getItem('locale')
      if (saved === 'vi' || saved === 'en') {
        locale.value = saved
      }
    })
  }

  return { t, locale, setLocale }
}
