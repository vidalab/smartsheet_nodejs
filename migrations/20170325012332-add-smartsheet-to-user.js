'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    queryInterface.addColumn(
      'Users',
      'smartsheet_id',
      Sequelize.BIGINT
    )

    queryInterface.addColumn(
      'Users',
      'email',
      Sequelize.STRING
    )

    queryInterface.addColumn(
      'Users',
      'first_name',
      Sequelize.STRING
    )

    queryInterface.addColumn(
      'Users',
      'last_name',
      Sequelize.STRING
    )
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    queryInterface.removeColumn('User', 'smartsheet_id')
    queryInterface.removeColumn('User', 'email')
    queryInterface.removeColumn('User', 'first_name')
    queryInterface.removeColumn('User', 'last_name')
  }
};
