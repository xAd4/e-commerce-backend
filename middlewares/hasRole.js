/**
 * Middleware factory to verify that the authenticated user has one of the required roles.
 *
 * This middleware checks if `req.userAuthenticated` exists (set by a previous token validation middleware)
 * and verifies that the user's role is included in the list of allowed roles.
 *
 * @param {...string} roles - The allowed roles.
 * @returns {Function} Express middleware function that validates the user's role.
 *
 * @example
 * // Protecting a route to allow only admin or moderator roles:
 * app.get('/protected', hasRole('admin', 'moderator'), (req, res) => {
 *   // Route logic here.
 * });
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userAuthenticated) {
      return res.status(500).json({
        msg: "Role verification attempted without validating the token first",
      });
    }

    if (!roles.includes(req.userAuthenticated.role)) {
      return res.status(401).json({
        msg: `The service requires one of these roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = hasRole;
