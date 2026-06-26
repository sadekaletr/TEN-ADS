export const buttonSpring = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25 },
};

export const pricingCardSpring = {
  whileHover: { scale: 1.03, y: -4 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 350, damping: 22 },
};

export const featuredPricingScale = {
  scale: 1.05,
};
