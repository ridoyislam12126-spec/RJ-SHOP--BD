'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PixelInjector() {
  const pathname = usePathname();

  useEffect(() => {
    const loadPixels = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        
        if (data.settings?.tiktokPixelId) {
          // Load TikTok Pixel
          if (typeof window !== 'undefined' && !window.ttq) {
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              ttq.load(data.settings.tiktokPixelId);
              ttq.page();
            }(window, document, 'ttq');
          }
        }
        
        if (data.settings?.metaPixelId) {
          // Load Meta Pixel
          if (typeof window !== 'undefined' && !window.fbq) {
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', data.settings.metaPixelId);
            fbq('track', 'PageView');
          }
        }
      } catch (error) {
        console.error('Error loading pixels:', error);
      }
    };
    
    // Add a small delay to prevent any loading issues
    const timer = setTimeout(loadPixels, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]); // Remove pixelsLoaded from dependency to prevent multiple loads

  return null;
}