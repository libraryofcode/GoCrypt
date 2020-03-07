/**
 * Hold a bunch of something
 */
export default class Collection<V> extends Map<string, V> {
  baseObject: any

  /**
   * Creates an instance of Collection
   */
  constructor(iterable: any[]|object = null) {
    if (iterable && iterable instanceof Array) {
      // @ts-ignore
      super(iterable);
    } else if (iterable && iterable instanceof Object) {
      // @ts-ignore
      super(Object.entries(iterable));
    } else {
      super();
    }
  }

  /**
   * Map to array
   * ```js
   * [value, value, value]
   * ```
   */
  toArray(): V[] {
    return [...this.values()];
  }

  /**
   * Map to object
   * ```js
   * { key: value, key: value, key: value }
   * ```
   */
  toObject(): object {
    const obj: object = {};
    for (const [key, value] of this.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Add an object
   *
   * If baseObject, add only if instance of baseObject
   *
   * If no baseObject, add
   * @param key The key of the object
   * @param value The object data
   * @param replace Whether to replace an existing object with the same key
   * @return The existing or newly created object
   */
  add(key: string, value: V, replace: boolean = false): V {
    if (this.has(key) && !replace) {
      return this.get(key);
    }
    if (this.baseObject && !(value instanceof this.baseObject)) return null;

    this.set(key, value);
    return value;
  }

  /**
   * Return the first object to make the function evaluate true
   * @param func A function that takes an object and returns something
   * @return The first matching object, or `null` if no match
   */
  find(func: Function): V {
    for (const item of this.values()) {
      if (func(item)) return item;
    }
    return null;
  }

  /**
   * Return an array with the results of applying the given function to each element
   * @param callbackfn A function that takes an object and returns something
   */
  map<U>(callbackfn: (value?: V, index?: number, array?: V[]) => U): U[] {
    const arr = [];
    for (const item of this.values()) {
      arr.push(callbackfn(item));
    }
    return arr;
  }

  /**
   * Return all the objects that make the function evaluate true
   * @param func A function that takes an object and returns true if it matches
   */
  filter(func: Function): V[] {
    const arr = [];
    for (const item of this.values()) {
      if (func(item)) {
        arr.push(item);
      }
    }
    return arr;
  }

  /**
   * Test if at least one element passes the test implemented by the provided function. Returns true if yes, or false if not.
   * @param func A function that takes an object and returns true if it matches
   */
  some(func: Function) {
    for (const item of this.values()) {
      if (func(item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Update an object
   * @param key The key of the object
   * @param value The updated object data
   */
  update(key: string, value: V) {
    return this.add(key, value, true);
  }

  /**
   * Remove an object
   * @param key The key of the object
   * @returns The removed object, or `null` if nothing was removed
   */
  remove(key: string): V {
    const item = this.get(key);
    if (!item) {
      return null;
    }
    this.delete(key);
    return item;
  }

  /**
   * Get a random object from the Collection
   * @returns The random object or `null` if empty
   */
  random(): V {
    if (!this.size) {
      return null;
    }
    return Array.from(this.values())[Math.floor(Math.random() * this.size)];
  }

  toString() {
    return `[Collection<${this.baseObject.name}>]`;
  }
}
