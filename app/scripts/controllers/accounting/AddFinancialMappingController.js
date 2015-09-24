(function(module) {
  mifosX.controllers = _.extend(module, {
    AddFinancialMappingController: function(scope, resourceFactory, location) {
      scope.formData = {};
      var financialActivityIds = {};

      resourceFactory.officeToGLAccountMappingResource.get({mappingId: 'template'}, function(data) {
        scope.formData.financialActivityId = 100;
        if (data.currencyOptions && data.currencyOptions.length) {
          scope.formData.currency = data.currencyOptions[0].code;
        }

        scope.glAccountOptions = data.glAccountOptions;
        scope.financialActivityOptions = data.financialActivityOptions;
        financialActivityIds = _.indexBy(data.financialActivityOptions, 'id');
        scope.accountOptions = scope.glAccountOptions.assetAccountOptions;
        scope.currencyOptions = data.currencyOptions;
      });

      scope.updateActivityOptions = function(financialActivityId) {
        if (financialActivityIds[financialActivityId]) {
          scope.accountOptions = getOptionsFormAccountType(financialActivityIds[financialActivityId].mappedGLAccountType);
        } else {
          scope.accountOptions = [];
        }
      };

      function getOptionsFormAccountType(mappedGLAccountType) {
        if (mappedGLAccountType === 'ASSET') {
          return scope.glAccountOptions.assetAccountOptions;
        } else if (mappedGLAccountType === 'LIABILITY') {
          return scope.glAccountOptions.liabilityAccountOptions;
        } else if (mappedGLAccountType === 'EQUITY') {
          return scope.glAccountOptions.equityAccountOptions;
        }
        return [];
      }

      scope.submit = function() {
        resourceFactory.officeToGLAccountMappingResource.create(this.formData, function(data) {
          location.path('/viewfinancialactivitymapping/' + data.resourceId);
        });
      };

    }
  });
  mifosX.ng.application.controller('AddFinancialMappingController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.AddFinancialMappingController]).run(function($log) {
    $log.info("AddFinancialMappingController initialized");
  });
}(mifosX.controllers || {}));
