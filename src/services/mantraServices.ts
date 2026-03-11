const MANTRAS = [
  "Gratitude turns what we have into enough.",
  "Small thankful moments build a meaningful life.",
  "Notice the good, and the good grows.",
  "Peace begins where appreciation begins.",
  "Today, choose thankfulness over hurry.",
  "Joy multiplies when gratitude is practiced daily.",
  "What you appreciate, appreciates in value.",
];

const getDaySeed = (date: Date) => Math.floor(date.getTime() / 86_400_000);

export const getMantraOfTheDaySvc = () => {
  const today = new Date();
  const mantraIndex = getDaySeed(today) % MANTRAS.length;

  return {
    status: "Ok",
    data: {
      mantra: MANTRAS[mantraIndex],
      date: today.toISOString().slice(0, 10),
    },
    items: 1,
  };
};
