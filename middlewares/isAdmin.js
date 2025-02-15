/**
 * Middleware to ensure that the authenticated user is an admin.
 *
 * This middleware assumes that a previous middleware has validated the JWT and attached the user
 * object to `req.userAuthenticated`.
 *
 * @param {import('express').Request} req - Express request object containing the authenticated user.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {void} Proceeds to the next middleware if the user is an admin; otherwise, sends an error response.
 *
 * @example
 * // Protecting an admin-only route:
 * app.delete('/admin-route', isAdmin, (req, res) => {
 *   // Route logic here.
 * });
 */
const isAdmin = (req, res, next) => {
  if (!req.userAuthenticated) {
    return res.status(500).json({
      msg: "Role verification attempted without validating the token first",
    });
  }

  const { role, name } = req.userAuthenticated;

  if (role !== "admin") {
    return res.status(401).json({
      msg: `${name} is not an admin - Unauthorized`,
    });
  }
  next();
};

module.exports = isAdmin;
