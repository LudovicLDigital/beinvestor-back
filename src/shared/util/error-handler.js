const Constant = require("../../shared/constants");

const {
    ValidationError,
    NotFoundError,
    DBError,
    ConstraintViolationError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError
} = require('objection');

class ErrorHandler {
    // In this example `res` is an express response object.
    static errorHandler(err, res) {
        if (err instanceof ValidationError) {
            switch (err.type) {
                case 'ModelValidation':
                    res.status(400).send({
                        message: err.message,
                        type: err.type,
                        data: err.data
                    });
                    break;
                case 'RelationExpression':
                    res.status(400).send({
                        message: err.message,
                        type: 'RelationExpression',
                        data: {}
                    });
                    break;
                case 'UnallowedRelation':
                    res.status(400).send({
                        message: err.message,
                        type: err.type,
                        data: {}
                    });
                    break;
                case 'InvalidGraph':
                    res.status(400).send({
                        message: err.message,
                        type: err.type,
                        data: {}
                    });
                    break;
                default:
                    res.status(400).send({
                        message: err.message,
                        type: 'UnknownValidationError',
                        data: {}
                    });
                    break;
            }
        } else if (err instanceof NotFoundError) {
            res.status(404).send({
                message: err.message,
                type: 'NotFound',
                data: {}
            });
        } else if (err instanceof UniqueViolationError) {
            res.status(409).send({
                message: err.message,
                type: 'UniqueViolation',
                data: {
                    columns: err.columns,
                    table: err.table,
                    constraint: err.constraint
                }
            });
        } else if (err instanceof NotNullViolationError) {
            res.status(400).send({
                message: err.message,
                type: 'NotNullViolation',
                data: {
                    column: err.column,
                    table: err.table
                }
            });
        } else if (err instanceof ForeignKeyViolationError) {
            res.status(409).send({
                message: err.message,
                type: 'ForeignKeyViolation',
                data: {
                    table: err.table,
                    constraint: err.constraint
                }
            });
        } else if (err instanceof CheckViolationError) {
            res.status(400).send({
                message: err.message,
                type: 'CheckViolation',
                data: {
                    table: err.table,
                    constraint: err.constraint
                }
            });
        } else if (err instanceof DataError) {
            res.status(400).send({
                message: err.message,
                type: 'InvalidData',
                data: {}
            });
        } else if (err instanceof DBError) {
            res.status(500).send({
                message: err.message,
                type: 'UnknownDatabaseError',
                data: {}
            });
        } else if (err.type === Constant.BAD_REQUEST) {
            res.status(400).send({
                message: err.message,
                type: Constant.BAD_REQUEST,
                data: {}
            })
        } else if (err.type === Constant.UNAUTHORIZE) {
            res.status(403).send({
                message: err.message,
                type: Constant.UNAUTHORIZE,
                data: {}
            })
        } else {
            res.status(500).send({
                message: err.message,
                type: 'UnknownError',
                data: {}
            });
        }
    }
}
module.exports = ErrorHandler;