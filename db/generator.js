function homeBuilder(size, f) {
  let HOUSE_PRICE;

  if (f >= 2 && f <= 4) {
    HOUSE_PRICE = 8_500_000;
  } else if (f >= 5 && f <= 8) {
    HOUSE_PRICE = 7_500_000;
  } else if (f >= 9 && f <= 12) {
    HOUSE_PRICE = 6_500_000;
  }

  const sizes = {
    38.08: 1,
    61.64: 2,
    44.51: 2,
    54.1: 2,
  };

  return {
    room: sizes[size],
    houseNumber: Math.trunc(Math.random() * 100),
    size: sizes[size],
    get price() {
      return 54.1 * HOUSE_PRICE;
    },
    status: "EMPTY",
    gallery: [`./gallery/${sizes[size]}_.jpg`],
    id: window.crypto.randomUUID(),
  };
}

function floorBuilder(f) {
  const structure = [61.64, 44.51, 61.64, 54.1, 44.51, 38.08];
  return structure.map((flr) => homeBuilder(flr, f));
}

function block(length) {
  return Array.from({ length }, (_) => _).map((_, index) => {
    return floorBuilder(index + 1);
  });
}

const readyData = {
  maxFloor: 12,
  blockCount: 1,
  blocks: {
    A: {
      floor: 12,
      get appartment() {
        return block(this.floor);
      },
    },
  },
};

export default readyData;
