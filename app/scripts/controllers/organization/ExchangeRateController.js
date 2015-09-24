(function(module) {
  mifosX.controllers = _.extend(module, {
    ExchangeRateController: function(scope, resourceFactory, location, dateFilter, $q, $timeout) {
      scope.exchangeRates = [];
      scope.allowedCurrencies = [];
      scope.datepicker = {};
      scope.exchangeRate = {};
      scope.editExchangeRate = function(item) {
        scope.showForm = true;
        $timeout(function() {
          scope.exchangeRate = angular.copy(item);
          delete scope.exchangeRate.rateType;
          scope.exchangeRate.date = new Date(scope.exchangeRate.date);
          scope.exchangeRate.typeId = item.rateType.id;
        });
      };

      scope.removeExchangeRate = function(item) {
        resourceFactory.exchangeRateResource.remove({exchangeRateId: item.id}, function() {
          updateExchangeRatesList();
          scope.exchangeRate = {};
          scope.showForm = false;
        });
      };

      scope.save = function() {
        var editMode = !!scope.exchangeRate.id;
        var data = angular.copy(scope.exchangeRate);
        data.locale = scope.optlang.code;
        data.dateFormat = scope.df;
        data.date = dateFilter(data.date, scope.df);
        var deferred = $q.defer();
        if (editMode) {
          delete data.id;
          resourceFactory.exchangeRateResource.update({exchangeRateId: scope.exchangeRate.id}, data, deferred.resolve, deferred.reject);
        } else {
          resourceFactory.exchangeRateResource.save({}, data, deferred.resolve, deferred.reject);
        }
        deferred.promise.then(function() {
          updateExchangeRatesList();
          scope.exchangeRate = {};
          scope.showForm = false;
        });
      };

      if (!scope.searchCriteria.exchangeRates) {
        scope.searchCriteria.exchangeRates = null;
        scope.saveSC();
      }
      scope.filterText = scope.searchCriteria.exchangeRates;

      scope.onFilter = function() {
        scope.searchCriteria.exchangeRates = scope.filterText;
        scope.saveSC();
      };

      function updateExchangeRatesList() {
        resourceFactory.exchangeRateResource.getAllExchangeRates(function(data) {
          scope.exchangeRates = data;
        });
      }
      updateExchangeRatesList();

      resourceFactory.exchangeRateResource.template(function(result) {
        scope.data = result;
      });
    }
  });
  mifosX.ng.application.controller('ExchangeRateController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$q', '$timeout', mifosX.controllers.ExchangeRateController]).run(function($log) {
    $log.info("ExchangeRateController initialized");
  });
}(mifosX.controllers || {}));