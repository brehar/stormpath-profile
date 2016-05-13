'use strict';

var app = angular.module('spApp', ['ui.router', 'stormpath', 'stormpath.templates']);

app.run(function($stormpath) {
    $stormpath.uiRouter({
        loginState: 'login',
        defaultPostLoginState: 'profile'
    });
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/html/home.html'
    }).state('login', {
        url: '/login',
        templateUrl: '/html/login.html'
    }).state('register', {
        url: '/register',
        templateUrl: '/html/register.html'
    }).state('profile', {
        url: '/profile',
        templateUrl: '/html/profile.html',
        controller: 'profileCtrl',
        sp: {
            authenticate: true
        }
    });

    $urlRouterProvider.otherwise('/');
});

app.controller('profileCtrl', function($user, $scope, $http) {
    $user.get().then(user => {
        $scope.user = user;
    }).catch(err => {
        console.error(err);
    });

    $scope.edit = () => {
        $scope.editing = true;
        $scope.editUser = angular.copy($scope.user);
    };

    $scope.cancelEdit = () => {
        $scope.editing = false;
        $scope.editUser = null;
    };

    $scope.saveEdit = () => {
        $http.put('/updateProfile', $scope.editUser).then(res => {
            $scope.user = res.config.data;
            $scope.cancelEdit();
        }).catch(err => {
            console.log('err:', err);
        });
    };
});