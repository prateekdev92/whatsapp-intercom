export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/whatsapp-intercom/whatsapp-intercom.html',
      controller: 'CommController',
      controllerAs: 'comCtrl'
    });

  $urlRouterProvider.otherwise('/');
}
