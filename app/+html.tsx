import { ScrollViewStyleReset } from 'expo-router/html'
import type { PropsWithChildren } from 'react'

export default function Root({ children }: PropsWithChildren) {
   return (
      <html lang='en'>
         <head>
            <meta charSet='utf-8' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
            <meta
               name='viewport'
               content='width=device-width, initial-scale=1, shrink-to-fit=no'
            />
            <meta name='description' content='A simple financial tracker app' />
            <meta property='og:title' content='Financial Tracker' />
            <title>Financial Tracker</title>
            <link rel='icon' href='/assets/images/favicon.png' type='image/png' />
            <link rel='manifest' href='manifest.json' />
            <ScrollViewStyleReset />
         </head>
         <body>
            {children}
            <script src="/register-sw.js"></script>
         </body>
      </html>
   )
}
