(function(ng, React) {

    var UserList = React.createClass({
        displayName: "UserList",
        render: function() {
            var users = this.props.scope.users;
            var scope = this.props.scope;

            var userList = users.map(function(user, index, array) {
                var clickHandler = scope.$apply.bind(scope,
                    scope.userSelected.bind(null, {user: user}));

                return React.DOM.li({ className: "user-item list-group-item", onClick: clickHandler },
                    [user.firstName, user.lastName].join(' - '));
            });

            return React.DOM.ul( {className:"user-list list-group"}, userList);
        }
    });

    var app = ng.module('app', []);

    var UserFactory = function() {
        var users = [
            {id: 1, firstName: "Denis", lastName: "Stoyanov", age:26},
            {id: 2, firstName: "Alex", lastName: "Alexeev", age:24},
            {id: 3, firstName: "Peter", lastName: "Petrov", age:21},
            {id: 4, firstName: "Ivan", lastName: "Ivanov", age:20}
        ];

        return {
            users: users
        };
    };

    var UserCtrl = function($scope, $log, User) {
        $scope.users = User.users;

        this.getUser = function(user) {
            $log.info('A selected user %O', user);
        };
    };

    var UserDirective = function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                users: '=',
                userSelected: '&'
            },
            link: function(scope, element, attrs) {
                scope.$watchCollection('users', function() {
                    React.renderComponent(UserList({scope: scope}), element[0]);
                });
            }
        };
    };

    app.directive('userList', UserDirective);

    app.factory('User', [UserFactory]);

    app.controller('MainCtrl', ['$scope', '$log', 'User', UserCtrl]);


    return app;

})(angular, React);