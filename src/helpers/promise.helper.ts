/** Attend `ms` millisecondes avant de résoudre. Utile pour temporiser un retry ou espacer des appels. */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
