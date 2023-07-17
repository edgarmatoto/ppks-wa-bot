/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('report', {
    id: 'id',
    name: {
      type: 'VARCHAR(60)',
      notNull: true,
    },
    phone_number: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('report');
};
