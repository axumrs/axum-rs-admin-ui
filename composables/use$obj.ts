export default function use$obj() {
  const $eq = (
    a: Record<string, any>,
    b: Record<string, any>,
    skip: string[] = []
  ) => {
    // const keysA = Object.keys(a).sort();
    // const keysB = Object.keys(b).sort();
    // const objA: Record<string, any> = {};
    // const objB: Record<string, any> = {};

    // for (const k of keysA) objA[k] = a[k];
    // for (const k of keysB) objB[k] = b[k];
    // return JSON.stringify(objA) === JSON.stringify(objB);

    const objA = skip.map((key) => (a[key] = undefined));
    const objB = skip.map((key) => (b[key] = undefined));
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const $neq = (
    a: Record<string, any>,
    b: Record<string, any>,
    skip: string[] = []
  ) => !$eq(a, b, skip);

  return { $eq, $neq };
}
