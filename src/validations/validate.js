const { GraphQLError } = require('graphql');

const validate = (schema) => {
  return (args) => {
    const { error } = schema.validate(args, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new GraphQLError('Validation Error', {
        extensions: {
          code: 'VALIDATION_ERROR',
          errors: errorMessages
        }
      });
    }
    return args;
  };
};

module.exports = validate; 