// https://egghead.io/blog/using-branded-types-in-typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;

// to see examples of creating branded types, read the "Real world usage" section of
// https://prosopo.io/articles/typescript-branding/

// For branding an entire class:
type Ctor<T> = new (...args: unknown[]) => T;

export const addBrand = <T>(ctor: Ctor<T>, name: string) => {
  return ctor as Ctor<Branded<T, typeof name>>;
};

/*

# Before addBrand:

class Dog {
    constructor(public name: string) {}
}

type DogBranded = Brand<Dog, 'Dog'>

const dog = new DogBranded('Spot') // Error!


# After addBrand:

const DogBranded = addBrand(Dog, 'Dog')

const dog = new DogBranded('Spot') // ok

*/

// to remove a brand
export type RemoveBrand<T> = T[Exclude<keyof T, typeof __brand>];

export const removeBrand = <T>(value: T) => {
  return value as RemoveBrand<T>
}