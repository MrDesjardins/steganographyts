/* eslint-disable @typescript-eslint/no-non-null-assertion */
import sharp from "sharp";
import path from "path";
import {
  packBit,
  unpackBit,
  getMinimumImageSizeByteRequired,
  charToBinaryString,
  binaryStringToChar,
  isBufferBigEnoughForMessage,
  NUMBER_BIT_PER_BYTE,
  addMessageIntoBuffer,
  getMessagerFromBuffer,
} from "./steganography";
describe("Test Raw", () => {
  it("Gives RGBA information for each pixel", async () => {
    const imagePath = path.join(__dirname, "..", "testAssets/prestine.png");
    console.log(imagePath);
    const { data } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
    expect(data.at(0)).toBe(90);
    expect(data.at(1)).toBe(88);
    expect(data.at(2)).toBe(91);
    expect(data.at(3)).toBe(255);
    expect(data.at(4)).toBe(92);
    expect(data.at(5)).toBe(90);
    expect(data.at(6)).toBe(93);
  });
});

describe(packBit.name, () => {
  describe("Number with LSB with 0", () => {
    const num: number = 90;
    it("returns 0", () => {
      expect(unpackBit(num)).toBe(0);
    });
  });
  describe("Number with LSB with 1", () => {
    const num: number = 91;
    it("returns 1", () => {
      expect(unpackBit(num)).toBe(1);
    });
  });
});

describe(unpackBit.name, () => {
  describe("with a number that has already a LSB of 1", () => {
    const num: number = 91;
    describe("Add 1", () => {
      it("does not change", () => {
        expect(packBit(num, 1)).toBe(91);
      });
    });
    describe("Add 0", () => {
      it("does change", () => {
        expect(packBit(num, 0)).toBe(90);
      });
    });
  });
  describe("with a number that has already a LSB of 0", () => {
    const num: number = 90;
    describe("Add 1", () => {
      it("does change", () => {
        expect(packBit(num, 1)).toBe(91);
      });
    });
    describe("Add 0", () => {
      it("does not change", () => {
        expect(packBit(num, 0)).toBe(90);
      });
    });
  });
});

describe(getMinimumImageSizeByteRequired.name, () => {
  describe("Three words", () => {
    const message = "Bye";
    it("needs 8*3 bytes", () => {
      expect(getMinimumImageSizeByteRequired(message)).toBe(8 * 3);
    });
  });
});

describe(charToBinaryString.name, () => {
  describe("Convert the char 'A'", () => {
    it("produces the binary value of 65", () => {
      expect(charToBinaryString(65)).toBe("01000001");
    });
    it("produces the binary value of 65", () => {
      expect(charToBinaryString(2)).toBe("00000010");
    });
  });
});

describe(binaryStringToChar.name, () => {
  describe("Convert the binary string 1000001", () => {
    it("produces the binary value of 65 which is A", () => {
      expect(binaryStringToChar("1000001")).toBe("A");
    });
  });
});

describe(isBufferBigEnoughForMessage.name, () => {
  const message = "Bye";
  describe("Buffer is bigger than the message", () => {
    const buffer: Buffer = Buffer.alloc(
      message.length * NUMBER_BIT_PER_BYTE + 1 //  +1 is to make it bigger
    );
    it("returns true", () => {
      expect(isBufferBigEnoughForMessage(message, buffer)).toBeTruthy();
    });
  });

  describe("Buffer is equal to the message length", () => {
    const buffer: Buffer = Buffer.alloc(message.length * NUMBER_BIT_PER_BYTE);
    it("returns true", () => {
      expect(isBufferBigEnoughForMessage(message, buffer)).toBeTruthy();
    });
  });

  describe("Buffer is smaller than the message", () => {
    const buffer: Buffer = Buffer.alloc(
      message.length * NUMBER_BIT_PER_BYTE - 1 //  -1 is to make it smaller
    );
    it("returns true", () => {
      expect(isBufferBigEnoughForMessage(message, buffer)).toBeFalsy();
    });
  });
});

describe(addMessageIntoBuffer.name, () => {
  const message = "Bye"; // [B, y, e] => [66, 89, 69] => [01000010, 01011001, 01000101] => [xxxxxx1, xxxxx0, xxxxx0,xxxxx0,xxxxxx1,xxxxxx0....]
  const buffer: Buffer = Buffer.alloc(
    message.length * NUMBER_BIT_PER_BYTE + NUMBER_BIT_PER_BYTE + 1, // + NUMBER_BIT_PER_BYTE is for the EOF character, +1 is to make it smaller
    "A"
  );
  describe("Set the message in an empty buffer", () => {
    const newBuffer = addMessageIntoBuffer(buffer, message);
    it("modified last bits of the new buffer", () => {
      expect(unpackBit(newBuffer.at(0)!)).toBe(0);
      expect(unpackBit(newBuffer.at(1)!)).toBe(1);
      expect(unpackBit(newBuffer.at(2)!)).toBe(0);
      expect(unpackBit(newBuffer.at(3)!)).toBe(0);
      expect(unpackBit(newBuffer.at(4)!)).toBe(0);
      expect(unpackBit(newBuffer.at(5)!)).toBe(0);
      expect(unpackBit(newBuffer.at(6)!)).toBe(1);
      expect(unpackBit(newBuffer.at(7)!)).toBe(0);
    });
  });
});

describe(getMessagerFromBuffer.name, () => {
  const message = "B"; // [B] => [66] => [01000010] => [xxxxxx1, xxxxx0, xxxxx0,xxxxx0,xxxxxx1,xxxxxx0....]
  const buffer: Buffer = Buffer.from(
    new Uint8Array([
      parseInt("00000000", 2),
      parseInt("00000001", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000001", 2),
      parseInt("00000000", 2),
      // End of File Character
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
      parseInt("00000001", 2),
      parseInt("00000000", 2),
      parseInt("00000000", 2),
    ])
  );
  describe("Set the message in an empty buffer", () => {
    it("retrieves the message (letter B)", () => {
      const hiddenMessage = getMessagerFromBuffer(buffer);
      expect(hiddenMessage).toBe(message);
    });
  });
});
