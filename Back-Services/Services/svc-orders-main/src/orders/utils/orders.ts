export const isBlockedByCredit = (creditBlockedReason: string): boolean => {
  return creditBlockedReason && creditBlockedReason !== '';
};
