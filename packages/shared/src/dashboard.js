/**
 * Participant dashboard actions — Final Override P2-01, seed
 * `participant_dashboard_actions` (seed_bundle_final_override_v1.json),
 * verbatim and in seed priority order. Handoff Mapping v1.1 §2: "Only:
 * Continue My Personal Profile; Today's Daily Log; Monthly Snapshot; Browse
 * Workers (optional). No other feature cards."
 *
 * `route` is the seed's own value, kept for the record; the web app resolves
 * each action to its real path by `key`. `optional` marks the one action that
 * a governance config may switch off without breaking the layout.
 */
export const DASHBOARD_ACTIONS = [
  {
    key: 'continue_profile',
    label: 'Continue My Personal Profile',
    description: 'Keep building the profile that belongs to you.',
    route: '/participant/profile',
    priority: 1,
    optional: false,
  },
  {
    key: 'daily_log',
    label: "Today's Daily Log",
    description: "Reflect on today's support when you are ready.",
    route: '/participant/daily-log',
    priority: 2,
    optional: false,
  },
  {
    key: 'monthly_snapshot',
    label: 'Monthly Snapshot',
    description: 'Review your recent patterns and add context if needed.',
    route: '/participant/monthly-snapshot',
    priority: 3,
    optional: false,
  },
  {
    key: 'browse_workers',
    label: 'Browse Workers',
    description: 'Browse verified independent workers when you choose.',
    route: '/participant/directory',
    priority: 4,
    optional: true,
  },
];

export const DASHBOARD_ACTION_KEYS = DASHBOARD_ACTIONS.map((action) => action.key);
