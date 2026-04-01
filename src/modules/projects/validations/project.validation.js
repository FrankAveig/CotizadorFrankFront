const VALID_TRANSITIONS = {
  pending_start: ['in_progress', 'canceled'],
  in_progress: ['completed', 'canceled'],
  completed: [],
  canceled: [],
};

export function validateStatusChange(currentStatus, newStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed) {
    return 'Estado actual no reconocido.';
  }

  if (!allowed.includes(newStatus)) {
    return `No se puede cambiar de "${currentStatus}" a "${newStatus}".`;
  }

  return null;
}

export function getValidTransitions(currentStatus) {
  return VALID_TRANSITIONS[currentStatus] || [];
}
