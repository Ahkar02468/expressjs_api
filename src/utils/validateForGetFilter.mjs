export const validateGetMethod = {
     filter: {
          isString: true,
          notEmpty: {
               errorMessage: "Must not be empty"
          },
          isLength: {
               options: {
                    min: 3,
                    max: 32,
               },
               errorMessage:
                    "Username must be at least 3 characters with a max of 32 characters",
          }
     }
}