const UserRepository = require('../src/app/repository/user/user-repository');
UserRepository.createUser({id: 1, login: 'admin', password: 'admin', mail: 'adminBeInvestor@yopmail.com', firstName: 'Admin', lastName: 'Admin', birthDate: "1917-01-01"});
UserRepository.createUser({id: 2, login: 'user', password: 'user', mail: 'userBeInvestor@yopmail.com', firstName: 'User', lastName: 'User', birthDate: "1917-01-01"});
process.exit(1);