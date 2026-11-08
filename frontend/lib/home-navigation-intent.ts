
let intentionalHomeNavigation = false;

export function markHomeNavigationIntent() {
  intentionalHomeNavigation = true;
}

export function consumeHomeNavigationIntent() {
  const intent = intentionalHomeNavigation;
  intentionalHomeNavigation = false;

  return intent;
}

export function clearHomeNavigationIntent() {
  intentionalHomeNavigation = false;
}
