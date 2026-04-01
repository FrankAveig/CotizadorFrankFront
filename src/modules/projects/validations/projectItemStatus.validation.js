/**
 * Transiciones permitidas para estado de ítem de proyecto (alineado al API).
 * @see PATCH /projects/:id/items/:itemId/status
 */
const TRANSITIONS = {
  pending: ['in_progress', 'canceled'],
  in_progress: ['completed', 'canceled', 'pending'],
  completed: ['in_progress', 'canceled'],
  canceled: ['pending'],
};

export function getValidProjectItemTransitions(currentStatus) {
  if (!currentStatus || !TRANSITIONS[currentStatus]) return [];
  return TRANSITIONS[currentStatus];
}
