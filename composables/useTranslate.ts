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

  // Detect language from route prefix or localStorage
  if (process.client) {
    onMounted(() => {
      const saved = localStorage.getItem('locale')
      if (saved === 'vi' || saved === 'en') {
        locale.value = saved
      } else {
        // Check route prefix
        const path = window.location.pathname
        if (path.startsWith('/en')) {
          locale.value = 'en'
        } else if (path.startsWith('/vi')) {
          locale.value = 'vi'
        }
      }
    })
  } else {
    // SSR: try to detect from route
    try {
      const route = useRoute()
      if (route.path.startsWith('/en')) {
        locale.value = 'en'
      } else if (route.path.startsWith('/vi')) {
        locale.value = 'vi'
      }
    } catch {}
  }

  return { t, locale, setLocale }
}
