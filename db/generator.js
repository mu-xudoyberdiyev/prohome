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
    status: f === 1 ? "NOT" : "EMPTY",
    image: [`./gallery/${sizes[size]}_.jpg`],
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
  blocks: {
    A: {
      floor: 12,
      appartment: {
        12: [
          {
            room: 2,
            houseNumber: 72,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 71,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 70,
            size: "43.56",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 69,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 68,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 67,
            size: "44.51",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        11: [
          {
            room: 2,
            houseNumber: 66,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 65,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 64,
            size: "43.56",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 63,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 62,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 61,
            size: "44.51",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        10: [
          {
            room: 2,
            houseNumber: 60,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 59,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 58,
            size: "43.56",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 57,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 56,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 55,
            size: "44.51",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        9: [
          {
            room: 2,
            houseNumber: 54,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 53,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 52,
            size: "43.56",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 51,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 50,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 49,
            size: "44.51",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        8: [
          {
            room: 2,
            houseNumber: 48,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 47,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 46,
            size: "43.56",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 45,
            size: "54.10",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 44,
            size: "61.64",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 43,
            size: "44.51",
            get price() {
              return this.size * 6_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        7: [
          {
            room: 2,
            houseNumber: 42,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 41,
            size: "54.10",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 40,
            size: "43.56",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 39,
            size: "54.10",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 38,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 37,
            size: "44.51",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        6: [
          {
            room: 2,
            houseNumber: 36,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 35,
            size: "54.10",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 34,
            size: "43.56",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 33,
            size: "54.10",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 32,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 31,
            size: "44.51",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        5: [
          {
            room: 2,
            houseNumber: 30,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 29,
            size: "54.10",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 28,
            size: "43.56",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 27,
            size: "54.10",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 26,
            size: "61.64",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 25,
            size: "44.51",
            get price() {
              return this.size * 7_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        4: [
          {
            room: 2,
            houseNumber: 24,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 23,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 22,
            size: "43.56",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 21,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 20,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 19,
            size: "44.51",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        3: [
          {
            room: 2,
            houseNumber: 18,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 17,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 16,
            size: "43.56",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 15,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 14,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 13,
            size: "44.51",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        2: [
          {
            room: 2,
            houseNumber: 12,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 11,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 10,
            size: "43.56",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 9,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 8,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 7,
            size: "44.51",
            get price() {
              return this.size * 8_500_000;
            },
            status: "EMPTY",
            image: "44.51",
          },
        ],
        1: [
          {
            room: 2,
            houseNumber: 6,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "NOT",
            image: "61.64-left",
          },
          {
            room: 2,
            houseNumber: 5,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "NOT",
            image: "54.10-left",
          },
          {
            room: 1,
            houseNumber: 4,
            size: "43.56",
            get price() {
              return this.size * 8_500_000;
            },
            status: "NOT",
            image: "43.56",
          },
          {
            room: 2,
            houseNumber: 3,
            size: "54.10",
            get price() {
              return this.size * 8_500_000;
            },
            status: "NOT",
            image: "54.10-right",
          },
          {
            room: 2,
            houseNumber: 2,
            size: "61.64",
            get price() {
              return this.size * 8_500_000;
            },
            status: "NOT",
            image: "61.64-right",
          },
          {
            room: 2,
            houseNumber: 1,
            size: "44.51",
            get price() {
              return this.size * 8_500_000;
            },
            status: "NOT",
            image: "44.51",
          },
        ],
      },
    },
  },
};

export default readyData;
