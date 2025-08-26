const GA_MEASUREMENT_ID = 'G-JXGEKF957C';

export default function GoogleAnalyticsSecure() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        crossOrigin="anonymous"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'max-age=7200;secure;samesite=strict'
            });
          `,
        }}
      />
    </>
  );
}