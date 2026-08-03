/**
 * The three TMG180 personas. Mirrors `tmg_*` role values on the API side and
 * the role prefixes used by the web router (/participant, /worker, /admin).
 */
export const ROLES = {
  PARTICIPANT: 'participant',
  WORKER: 'worker',
  ADMIN: 'admin',
};

export const ALL_ROLES = Object.values(ROLES);

export function isRole(value) {
  return ALL_ROLES.includes(value);
}
