/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { CommController } from './whatsapp-intercom/whatsapp-intercom.controller';
import { commService } from './whatsapp-intercom/whatsapp-intercom.service';

angular.module('whatsappIntercom', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
//  .service('commService', commService)
  .controller('CommController', CommController)
