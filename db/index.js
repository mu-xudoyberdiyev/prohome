function homeBuilder(room) {
  const statuses = ["sold", "empty"];
  const randomIndex = Math.trunc(Math.random() * statuses.length);
  const sizes = {
    1: 35,
    2: 50.4,
    3: 60.4,
    4: 76,
  };
  return {
    room,
    size: sizes[room],
    price: 9,
    status: statuses[randomIndex],
    view: {
      "2d": "",
      "3d": "",
    },
  };
}

function floorBuilder() {
  const structure = [2, 2, 3, 3, 4, 1];
  return structure.map((flr) => homeBuilder(flr));
}

function block(length) {
  return Array.from({ length }, (_) => _).map(() => {
    return floorBuilder();
  });
}

const readyData = {
  maxFloor: 16,
  blockCount: 3,
  blocks: {
    A: {
      floor: 16,
      get appartment() {
        return block(this.floor);
      },
    },
    B: {
      floor: 16,
      get appartment() {
        return block(this.floor);
      },
    },
    C: {
      floor: 12,
      get appartment() {
        return block(this.floor);
      },
    },
    D: {
      floor: 10,
      get appartment() {
        return block(this.floor);
      },
    },
    E: {
      floor: 10,
      get appartment() {
        return block(this.floor);
      },
    },
    F: {
      floor: 8,
      get appartment() {
        return block(this.floor);
      },
    },
    G: {
      floor: 8,
      get appartment() {
        return block(this.floor);
      },
    },
  },
};

export default readyData;
