(function(module) {
  mifosX.controllers = _.extend(module, {
    ForexExchangeController: function(scope, resourceFactory, location, dateFilter, $q, $timeout, $modal) {
      scope.exchangeRates = [];
      scope.allowedCurrencies = [];

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
        resourceFactory.forexExchangeResource.remove({exchangeRateId: item.id}, function() {
          updateForexExchangeList();
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
          resourceFactory.forexExchangeResource.update({exchangeRateId: scope.exchangeRate.id}, data, deferred.resolve, deferred.reject);
        } else {
          resourceFactory.forexExchangeResource.save({}, data, deferred.resolve, deferred.reject);
        }
        deferred.promise.then(function() {
          updateForexExchangeList();
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

      function updateForexExchangeList() {
        resourceFactory.forexExchangeResource.getAllForexExchanges(function(data) {
          scope.forexExchanges = data;
        });
      }
      updateForexExchangeList();

      var EditForexExchangeCtrl = function($scope, $modalInstance) {
        $scope.forexExchange = {};
        $scope.datepicker = {};
        resourceFactory.forexExchangeResource.template(function(result) {
          $scope.data = result;
        });

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
        $scope.save = function() {
          var editMode = !!$scope.forexExchange.id;
          var data = angular.copy($scope.forexExchange);
          data.locale = scope.optlang.code;
          data.dateFormat = scope.df;
          data.transactionDate = dateFilter(data.transactionDate, scope.df);
          var deferred = $q.defer();
          if (editMode) {
            delete data.id;
            resourceFactory.forexExchangeResource.update({forexExchangeId: $scope.forexExchange.id}, data, deferred.resolve, deferred.reject);
          } else {
            resourceFactory.forexExchangeResource.save({}, data, deferred.resolve, deferred.reject);
          }
          deferred.promise.then(function() {
            updateForexExchangeList();
            $scope.forexExchange = {};
            $modalInstance.close();
          });
        };
      };
      scope.openEditForexExchangeDialog = function() {
        $modal.open({
          templateUrl: 'edit-forexexchange-dialog.html',
          controller: EditForexExchangeCtrl,
          size: "lg"
        });
      };
    }
  });
  mifosX.ng.application.controller('ForexExchangeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$q', '$timeout', '$modal', mifosX.controllers.ForexExchangeController]).run(function($log) {
    $log.info("ForexExchangeController initialized");
  });
}(mifosX.controllers || {}));