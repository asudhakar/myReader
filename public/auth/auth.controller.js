'use strict';

angular
	.module('readLater')
	.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ["Auth", "$log", "$state"];

function AuthCtrl(Auth, $log, $state) {
	let self = this;

	self.login = login;
	self.register = register;

	self.user = {
		emailId: '',
		password: ''
	};

	function login(isValid) {
		if (!isValid) {
			return;
		}
		Auth
			.login(self.user)
			.then((data) => {
				$log.info("Auth Successful");
				$state.go('home');
			})
			.catch((error) => {
				$log.error(error);
			});
	}

	function register(isValid) {
		if (!isValid) {
			return;
		}
		Auth
			.signup(self.user)
			.then((data) => {
				$log.info("registeration Successful");
				$state.go('home');
			})
			.catch((error) => {
				$log.error(error);
			});
	}

}
