export const seededRandom = (id: string): (() => number) => {
  let n = 0;

  //loop through the place id and convert the alphanumeric string into a long number
  for (let i = 0; i < id.length; i++) {
    n = (n * 31 + id.charCodeAt(i)) % 2147483563;
  }

  //perform LCG combination algorithm to produce random integer
  return () => {
    n = (n * 40014 + 0) % 2147483563;
    return n / 2147483563;
  };
};
