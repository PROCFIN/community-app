(function(module) {
  mifosX.controllers = _.extend(module, {
    CashierTransactionsController: function(scope, routeParams, route, location, resourceFactory) {

      scope.cashiertxns = [];
      scope.txnPerPage = 15;
      scope.formData = [];
      scope.tabs = {};
      scope.selectedCurrencyCode = routeParams.currencyCode || 'ALL';
      var selectedTab = routeParams.tab || 'cash';
      scope.tabs[selectedTab] = true;

      scope.routeTo = function(id) {
        location.path('/viewcashiertxns/' + id);
      };

      scope.routeToAllocate = function() {
        location.path('tellers/' + routeParams.tellerId + '/cashiers/' + routeParams.cashierId + '/actions/allocate');
      };

      scope.routeToSettle = function() {
        location.path('tellers/' + routeParams.tellerId + '/cashiers/' + routeParams.cashierId + '/actions/settle');
      };

      scope.routeToTxn = function() {
        var path = '/tellers/' + routeParams.tellerId + "/cashiers/" + routeParams.cashierId + "/txns/" + selectedTab + '/' + (scope.formData.currencyCode || 'ALL');
        location.path(path);
      };

      resourceFactory.currencyConfigResource.get({fields: 'selectedCurrencyOptions'}, function(data) {
        var options = [];
        options.push({
          code: 'ALL',
          name: 'ALL',
          displayLabel: 'ALL'
        });
        scope.currencyOptions = _.union(options, data.selectedCurrencyOptions);
        scope.formData.currencyCode = routeParams.currencyCode;
        scope.selectTab = function(tab) {
          selectedTab = tab;
          scope.routeToTxn();
        };
        if (scope.tabs && scope.tabs.forex) {
          scope.getForexExchangeTransactions();
        } else {
          scope.getCashierSummaryAndTransactions();
        }
      });

      scope.deepCopy = function(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
          var out = [], i = 0, len = obj.length;
          for (; i < len; i++) {
            out[i] = arguments.callee(obj[i]);
          }
          return out;
        }
        if (typeof obj === 'object') {
          var out = {}, i;
          for (i in obj) {
            out[i] = arguments.callee(obj[i]);
          }
          return out;
        }
        return obj;
      }

      scope.getResultsPage = function(pageNumber) {
        resourceFactory.tellerCashierSummaryAndTxnsResource.getCashierSummaryAndTransactions({
          tellerId: routeParams.tellerId,
          cashierId: routeParams.cashierId,
          currencyCode: routeParams.currencyCode || '',
          offset: ((pageNumber - 1) * scope.txnPerPage),
          limit: scope.txnPerPage
        }, function(data) {
          scope.cashierSummaryAndTxns = data;
          scope.cashierTransactions = data.pageItems;
        });
      }
      scope.getCashierSummaryAndTransactions = function() {
        var items = resourceFactory.tellerCashierSummaryAndTxnsResource.getCashierSummaryAndTransactions({
          tellerId: routeParams.tellerId,
          cashierId: routeParams.cashierId,
          currencyCode: routeParams.currencyCode || '',
          offset: 0,
          limit: scope.txnPerPage
        }, function(data) {
          scope.cashierSummaryAndTxns = data;
          scope.totaltxn = data.totalFilteredRecords;
          scope.cashierTransactions = data.cashierTransactions;
        });
      };
      scope.getForexExchangeTransactions = function() {
        var items = resourceFactory.forexExchangeResource.getForexExchangeTransactions({
          tellerId: routeParams.tellerId,
          cashierId: routeParams.cashierId,
          currencyCode: routeParams.currencyCode || '',
          offset: 0,
          limit: scope.txnPerPage
        }, function(data) {
          scope.forexExchangeTransactions = data;
        });
      };
    }
  });
  mifosX.ng.application.controller('CashierTransactionsController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', mifosX.controllers.CashierTransactionsController]).run(function($log) {
    $log.info("CashierTransactionsController initialized");
  });
}(mifosX.controllers || {}));
