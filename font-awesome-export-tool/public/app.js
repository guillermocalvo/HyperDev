function MainController($scope, $http, $uibModal) {
  $scope.filter = {keyword: ''};
  $scope.groups = {};
  
  // load font awesome info
  $http.get('/api/fontawesome.json').then(function (result) {
    angular.forEach(result.data, function (icon) {
      if (!$scope.groups[icon.group]) {
        $scope.groups[icon.group] = {
          name: icon.group,
          icons: []
        };
      }
      $scope.groups[icon.group].icons.push(icon);
    });
    $scope.icons = result.data;
    console.log(result)
  }, function (err) {
    console.error(err);
    alert('Cannot load fontawesome info. ' + err.message);
  });
  
  $scope.getInlineImage = function (icon) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/templates/export.html',
      controller: 'ExportController',
      size: 'lg',
      resolve: {
        icon: function () {
          return icon;
        }
      }
    });
  };
}

function ExportController($scope, $uibModalInstance, icon) {
  $scope.options = {width: 24, height: 24, size: 24, color: '#000000'};
  icon.uri = fa2Uri(icon, $scope.options);
  $scope.icon = icon;
  
  $scope.$watch('options', function () {
    $scope.icon.uri = fa2Uri(icon, $scope.options);
  }, true);
  
  $scope.ok = function () {
    $uibModalInstance.close($scope.icon);
  }
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
}

function fa2Uri(icon, options) {
  options = options || {}
  options.width = options.width || 24;
  options.height = options.height || 24;
  options.color = options.color || '#000000';
  options.size = options.size || 24;
  
  var canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;

  var ctx = canvas.getContext("2d");
  ctx.fillStyle = options.color;
  ctx.font = options.size + "px FontAwesome";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String.fromCharCode('0x' + icon.unicode.replace('\\', '')), 12, 12);
  var dataURL = canvas.toDataURL('image/png');
  
  return dataURL;
}

angular.module('FACursor', ['ui.bootstrap'])
  .controller('MainController', MainController)
  .controller('ExportController', ExportController)