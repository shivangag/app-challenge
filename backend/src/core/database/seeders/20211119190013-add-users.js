'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkInsert('Users', [
      {
        name: 'Test',
        email: 'test@gmail.com',
        password: '$2b$10$tUzfC/jmTsa..tpnFX0iEusQrCIsfxOFfeVUpsC/VW9HDQ6KqTWIy', // 12345
        phoneNumber: '8768575888',
        uuid: '75442486-0878-440c-9db1-a7006c25a39f',
        status: true,
        properties: 'type:admin',
      },
      {
        name: 'Test 2',
        email: 'test2@gmail.com',
        password: '$2b$10$tUzfC/jmTsa..tpnFX0iEusQrCIsfxOFfeVUpsC/VW9HDQ6KqTWIy',
        phoneNumber: '8768575888',
        uuid: 'bedc47d1-c778-43fd-8c07-78b05aacadb7',
        status: true,
        properties: 'type:admin',
      },
      {
        name: 'Test 3',
        email: 'test3@gmail.com',
        password: '$2b$10$tUzfC/jmTsa..tpnFX0iEusQrCIsfxOFfeVUpsC/VW9HDQ6KqTWIy',
        phoneNumber: '8768575888sadaa',
        uuid: '75442486-0878-440c-9db1-a7006c25a39b',
        status: true,
        properties: 'type:admin',
      },
      {
        name: 'Test 4',
        email: 'test4@gmail.com',
        password: '$2b$10$tUzfC/jmTsa..tpnFX0iEusQrCIsfxOFfeVUpsC/VW9HDQ6KqTWIy',
        phoneNumber: '8768575888',
        uuid: '75442486-0878-440c-9db1-a7006c25a38f',
        status: true,
        properties: 'type:admin',
      },
      {
        name: 'Test 5',
        email: 'test5@gmail.com',
        password: '$2b$10$tUzfC/jmTsa..tpnFX0iEusQrCIsfxOFfeVUpsC/VW9HDQ6KqTWIy',
        phoneNumber: '8768575888',
        uuid: '75442486-0878-440c-9db1-a7006c25a19f',
        status: true,
        properties: 'type:admin',
      },
    ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
