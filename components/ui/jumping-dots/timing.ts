/** One leg of the bounce (up or down). Slower = easier to read the wave. */
export const JUMPING_DOT_HALF_MS = 320;

/** Full up+down cycle; stagger is derived so each dot is 1/3 of a cycle apart. */
export const JUMPING_DOT_CYCLE_MS = JUMPING_DOT_HALF_MS * 2;

export const JUMPING_DOT_STAGGER_MS = JUMPING_DOT_CYCLE_MS / 3;

export const JUMPING_DOT_AMPLITUDE_PX = 6;
