export const ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  STAFF: 3,
  CUSTOMER: 4,
};
export const ROLE_NAMES = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.STAFF]: "Staff",
  [ROLES.CUSTOMER]: "Customer",
};
export function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedToken = JSON.parse(window.atob(base64));
    console.log('Decoded token:', decodedToken); // Add this line
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
export function hasRequiredRole(userRole, requiredRole) {
    return userRole <= requiredRole;
  }