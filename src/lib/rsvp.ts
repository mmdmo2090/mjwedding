// Placeholder — update once you've settled on a real RSVP cutoff date.
export const RSVP_DEADLINE = new Date("2027-01-01T00:00:00Z");

export function isRsvpOpen(): boolean {
  return new Date() < RSVP_DEADLINE;
}
