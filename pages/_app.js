// pages/_app.js

import { Provider } from 'react-redux';
import Script from 'next/script';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import "../styles/homepageContent.scss";
import "../styles/globals.scss";
import "../styles/Profile.scss";


function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Script id="rewardful-loader" strategy="afterInteractive">
          {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}
        </Script>
        {/* Next.js injects afterInteractive scripts into the document head and runs them once hydration completes. */}
        <Script
          id="rewardful-sdk"
          strategy="afterInteractive"
          async
          src="https://r.wdfl.co/rw.js"
          data-rewardful="98d039"
        />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
