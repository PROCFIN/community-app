(function(module) {
  mifosX.controllers = _.extend(module, {
    EditFinancialActivityMappingController: function(scope, resourceFactory, location, routeParams) {
      scope.formData = {};
      scope.accountOptions = [];
      var financialActivityIds = {};
      resourceFactory.officeToGLAccountMappingResource.withTemplate({mappingId: routeParams.mappingId}, function(data) {
        scope.mapping = data;
        scope.glAccountOptions = data.glAccountOptions;
        scope.formData.financialActivityId = data.financialActivityData.id;
        scope.formData.glAccountId = data.glAccountData.id;
        scope.formData.currency = data.currency;
        scope.financialActivityOptions = data.financialActivityOptions;
        scope.currencyOptions = data.currencyOptions;
        financialActivityIds = _.indexBy(data.financialActivityOptions, 'id');
        scope.updateActivityOptions(data.financialActivityData.id);
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
        resourceFactory.officeToGLAccountMappingResource.update({mappingId: routeParams.mappingId}, this.formData, function(data) {
          location.path('/viewfinancialactivitymapping/' + data.resourceId);
        });
      };
    }
  });
  mifosX.ng.application.controller('EditFinancialActivityMappingController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditFinancialActivityMappingController]).run(function($log) {
    $log.info("EditFinancialActivityMappingController initialized");
  });
}(mifosX.controllers || {}));
