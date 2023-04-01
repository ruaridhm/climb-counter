const fs = require("fs");
const writeToJson = require("./writeToJson");

jest.mock("fs");

describe("writeToJson", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should add data to the object and write to file when date already exists", (done) => {
    const mockData = JSON.stringify({
      "2022-01-01": [{ time: "10:00", count: 1 }],
    });
    const expectedData = JSON.stringify({
      "2022-01-01": [
        { time: "10:00", count: 1 },
        { time: "11:00", count: 2 },
      ],
    });
    fs.readFile.mockImplementation((path, callback) => {
      callback(null, mockData);
    });
    fs.writeFile.mockImplementation((path, data, callback) => {
      expect(data).toEqual(expectedData);
      callback();
      done();
    });
    const inputData = {
      date: "2022-01-01",
      time: "11:00",
      count: 2,
    };
    writeToJson(inputData);
  });

  it("should add data to the object and write to file when date does not exist", (done) => {
    const mockData = JSON.stringify({});
    const expectedData = JSON.stringify({
      "2022-01-01": [{ time: "10:00", count: 1 }],
    });
    fs.readFile.mockImplementation((path, callback) => {
      callback(null, mockData);
    });
    fs.writeFile.mockImplementation((path, data, callback) => {
      expect(data).toEqual(expectedData);
      callback();
      done();
    });
    const inputData = {
      date: "2022-01-01",
      time: "10:00",
      count: 1,
    };
    writeToJson(inputData);
  });

  it("should throw an error when reading the file fails", () => {
    fs.readFile.mockImplementation((path, callback) => {
      callback(new Error("Failed to read file"));
    });
    const inputData = {
      date: "2022-01-01",
      time: "10:00",
      count: 1,
    };
    expect(() => writeToJson(inputData)).toThrowError("Failed to read file");
  });

  it("should throw an error when writing to the file fails", (done) => {
    const mockData = JSON.stringify({});
    fs.readFile.mockImplementation((path, callback) => {
      callback(null, mockData);
    });
    fs.writeFile.mockImplementation((path, data, callback) => {
      callback(new Error("Failed to write to file"));
    });
    const inputData = {
      date: "2022-01-01",
      time: "10:00",
      count: 1,
    };
    expect(() => writeToJson(inputData)).toThrowError(
      "Failed to write to file"
    );
    done();
  });
});
