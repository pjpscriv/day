import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { KEY } from '../key';

if (environment.production) {
  enableProdMode();
}

const scriptTag = document.createElement('script');
scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places`;
scriptTag.async = true;
document.head.appendChild(scriptTag);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
