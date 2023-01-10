/* eslint-disable @typescript-eslint/no-non-null-assertion */
import sharp from "sharp";
import path from "path";
import fs from "fs";
import * as steganography from "./steganography";
const OUT_FILE_NAME = "out.png";

describe("Test Raw from image path", () => {
  it("Gives RGBA information for each pixel", async () => {
    const imagePath = path.join(__dirname, "..", "testAssets/prestine.png");
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

describe("Test Raw from buffer", () => {
  it("Gives RGBA information for each pixel", async () => {
    const imagePath = path.join(__dirname, "..", "testAssets/prestine.png");
    const buffer = fs.readFileSync(imagePath);
    const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
    expect(data.at(0)).toBe(90);
    expect(data.at(1)).toBe(88);
    expect(data.at(2)).toBe(91);
    expect(data.at(3)).toBe(255);
    expect(data.at(4)).toBe(92);
    expect(data.at(5)).toBe(90);
    expect(data.at(6)).toBe(93);
  });
});
describe("Testing Saving File", () => {
  afterEach(() => {
    fs.unlinkSync(OUT_FILE_NAME);
  });
  describe("Test Saving File without Changing Pixel", () => {
    it("Saves a file that is the same", async () => {
      await steganography.addMessageToImage("", "testAssets/prestine.png", OUT_FILE_NAME);
    });
  });

  describe("Save Image and Read Image", () => {
    it("Retrieves the message", async () => {
      const originalText = "Test 123";
      await steganography.addMessageToImage(originalText, "testAssets/prestine.png", OUT_FILE_NAME);
      const text = await steganography.getMessageFromImage(OUT_FILE_NAME);
      expect(text).toBe(originalText);
    });
  });
});
describe(steganography.unpackBit.name, () => {
  describe("Number with LSB with 0", () => {
    const num: number = 90;
    it("returns 0", () => {
      expect(steganography.unpackBit(num)).toBe(0);
    });
  });
  describe("Number with LSB with 1", () => {
    const num: number = 91;
    it("returns 1", () => {
      expect(steganography.unpackBit(num)).toBe(1);
    });
  });
});

describe(steganography.packBit.name, () => {
  describe("with a number that has already a LSB of 1", () => {
    const num: number = 91;
    describe("Add 1", () => {
      it("does not change", () => {
        expect(steganography.packBit(num, 1)).toBe(91);
      });
    });
    describe("Add 0", () => {
      it("does change", () => {
        expect(steganography.packBit(num, 0)).toBe(90);
      });
    });
  });
  describe("with a number that has already a LSB of 0", () => {
    const num: number = 90;
    describe("Add 1", () => {
      it("does change", () => {
        expect(steganography.packBit(num, 1)).toBe(91);
      });
    });
    describe("Add 0", () => {
      it("does not change", () => {
        expect(steganography.packBit(num, 0)).toBe(90);
      });
    });
  });
});

describe(steganography.getMinimumImageSizeByteRequired.name, () => {
  describe("Three chars", () => {
    const message = "Bye";
    it("needs 8*3 bytes", () => {
      expect(steganography.getMinimumImageSizeByteRequired(message)).toBe(8 * 3);
    });
  });
});

describe(steganography.charToBinaryString.name, () => {
  describe("Convert the char 'A'", () => {
    it("produces the binary value of 65", () => {
      expect(steganography.charToBinaryString(65)).toBe("01000001");
    });
    it("produces the binary value of 2", () => {
      expect(steganography.charToBinaryString(2)).toBe("00000010");
    });
  });
});

describe(steganography.binaryStringToChar.name, () => {
  describe("Convert the binary string 1000001", () => {
    it("produces the binary value of 65 which is A", () => {
      expect(steganography.binaryStringToChar("1000001")).toBe("A");
    });
  });
});

describe(steganography.isBufferBigEnoughForMessage.name, () => {
  const message = "Bye";
  describe("Buffer is bigger than the message", () => {
    const buffer: Buffer = Buffer.alloc(
      message.length * steganography.NUMBER_BIT_PER_BYTE + 1 //  +1 is to make it bigger
    );
    it("returns true", () => {
      expect(steganography.isBufferBigEnoughForMessage(message, buffer)).toBeTruthy();
    });
  });

  describe("Buffer is equal to the message length", () => {
    const buffer: Buffer = Buffer.alloc(message.length * steganography.NUMBER_BIT_PER_BYTE);
    it("returns true", () => {
      expect(steganography.isBufferBigEnoughForMessage(message, buffer)).toBeTruthy();
    });
  });

  describe("Buffer is smaller than the message", () => {
    const buffer: Buffer = Buffer.alloc(
      message.length * steganography.NUMBER_BIT_PER_BYTE - 1 //  -1 is to make it smaller
    );
    it("returns true", () => {
      expect(steganography.isBufferBigEnoughForMessage(message, buffer)).toBeFalsy();
    });
  });
});

describe(steganography.addMessageIntoBuffer.name, () => {
  const message = "Bye"; // [B, y, e] => [66, 89, 69] => [01000010, 01011001, 01000101] => [xxxxxx1, xxxxx0, xxxxx0,xxxxx0,xxxxxx1,xxxxxx0....]
  const buffer: Buffer = Buffer.alloc(
    message.length * steganography.NUMBER_BIT_PER_BYTE + steganography.NUMBER_BIT_PER_BYTE + 1, // + NUMBER_BIT_PER_BYTE is for the EOF character, +1 is to make it smaller
    "A"
  );
  describe("Set the message in an empty buffer", () => {
    const newBuffer = steganography.addMessageIntoBuffer(buffer, message);
    it("modified last bits of the new buffer", () => {
      expect(steganography.unpackBit(newBuffer.at(0)!)).toBe(0);
      expect(steganography.unpackBit(newBuffer.at(1)!)).toBe(1);
      expect(steganography.unpackBit(newBuffer.at(2)!)).toBe(0);
      expect(steganography.unpackBit(newBuffer.at(3)!)).toBe(0);
      expect(steganography.unpackBit(newBuffer.at(4)!)).toBe(0);
      expect(steganography.unpackBit(newBuffer.at(5)!)).toBe(0);
      expect(steganography.unpackBit(newBuffer.at(6)!)).toBe(1);
      expect(steganography.unpackBit(newBuffer.at(7)!)).toBe(0);
    });
  });

  describe("When the buffer is smaller than the message", () => {
    const bufferSmall: Buffer = Buffer.alloc(message.length, "A");
    it("throws an exception", () => {
      expect(() => {
        steganography.addMessageIntoBuffer(bufferSmall, message);
      }).toThrow("The message is too big for the buffer");
    });
  });
  describe("When isBufferBigEnough logic fails", () => {
    const bufferSmall: Buffer = Buffer.alloc(message.length, "A");
    it("throws an exception", () => {
      jest.spyOn(steganography, "isBufferBigEnoughForMessage").mockReturnValue(true);
      expect(() => {
        steganography.addMessageIntoBuffer(bufferSmall, message);
      }).toThrow(
        "The content is too big for the image size. The logic on isBufferBigEnoughForMessage has a flaw."
      );
    });
  });
});

describe(steganography.getMessagerFromBuffer.name, () => {
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
      const hiddenMessage = steganography.getMessagerFromBuffer(buffer);
      expect(hiddenMessage).toBe(message);
    });
  });
});
