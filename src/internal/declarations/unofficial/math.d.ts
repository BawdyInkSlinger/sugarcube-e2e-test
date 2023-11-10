declare global {
  interface Math {
    /**
     * Returns a decimal number eased from 0 to 1. The magnitude of the returned value decreases if num < 0.5 or increases if num > 0.5.
     * @param num The number to ease. May be an actual number or a numerical string.
     * @since 2.0.0
     * @example
     * Math.easeInOut("0") // returns 0
     * Math.easeInOut(.5) // returns 0.5
     * Math.easeInOut(.25) // returns 0.14644660940672627
     * Math.easeInOut("1") // returns 1
     * Math.easeInOut(1.5) // returns 0.5000000000000001
     */
    easeInOut(num: number): number;

    seedrandom: seedrandom.prng;
  }
}

export {};
