/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.addColumn('notes', {
        owner: {
            type: 'VARCHAR(50)'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('notes', 'owner')
};
