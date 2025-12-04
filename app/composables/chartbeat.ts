import { ref } from 'vue'

interface ChartbeatConfig {
  uid: string
  domain: string
  useCanonical: boolean
}

declare global {
  interface Window {
    _sf_async_config?: ChartbeatConfig
    pSUPERFLY?: {
      virtualPage: (props?: Record<string, unknown>) => void
    }
  }
}

export function useChartbeat(initialConfig = {}, configEnv: ReturnType<typeof useRuntimeConfig>) {
  onMounted(() => {
    if (import.meta.client) {
      interface ConfigType {
        uid: number
        domain: string
        sections?: string
        authors?: string
      }

      const config = ref<ConfigType>({
        uid: Number(configEnv.public.chartbeatUID) as number,
        domain: configEnv.public.chartbeatDomain as string,
        ...initialConfig,
      })

      const { data, token } = useAuth()

      let subscriberStatus = 'anon'
      if (token?.value) {
        subscriberStatus = 'lgdin'
        if (data.value?.vip_subscription || data.value?.nonvip_subscription) {
          subscriberStatus = 'paid'
        }
      }

      useHead({
        script: [
          {
            type: 'text/javascript',
            innerHTML: `
              (function() {
                var _sf_async_config = window._sf_async_config = (window._sf_async_config || {});
                _sf_async_config.uid = ${config.value.uid};
                _sf_async_config.domain = '${config.value.domain}';
                _sf_async_config.flickerControl = false;
                _sf_async_config.useCanonical = true;
                _sf_async_config.useCanonicalDomain = true;
                _sf_async_config.sections = '${config.value.sections}';
                _sf_async_config.authors = '${config.value.authors}';
                var _cbq = window._cbq = (window._cbq || []);
                _cbq.push(['_acct', '${subscriberStatus}']);
                  function loadChartbeat() {
                      var e = document.createElement('script');
                      var n = document.getElementsByTagName('script')[0];
                      e.type = 'text/javascript';
                      e.async = true;
                      e.src = '//static.chartbeat.com/js/chartbeat.js';
                      n.parentNode.insertBefore(e, n);
                  }
                  loadChartbeat();
              })();
            `,
          },
        ],
      })
    }
  })
}
