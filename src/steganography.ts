/**
Based on the idea outlined here: http://domnit.org/blog/2007/02/stepic-explanation.html

Further reading:
- https://en.wikipedia.org/wiki/Bit_numbering#Bit_significance_and_indexing#Least_significant_bit_in_digital_steganography
*/

import sharp from "sharp";

/**
 * 0 or 1
 **/
type Binary = number;

/**
 * 0 to 255
 **/
type Rgba = number;

/**
 * 1 byte = 8 bits
 **/
export const NUMBER_BIT_PER_BYTE = 8;

/**
 * Character to determine where to stop reading the image
 **/
export const EOF_CHAR = String.fromCharCode(4);

/*
Reads the least significant bits of the pixel (Red, Green and Blue) and
add them to the corresponding position of the byte being constructed
*/
export function unpackBit(bufferItem: Rgba): Binary {
  // If the bufferItem (R or G or B or A) finish with a 1 (instead of of 0)
  return (bufferItem & (1 << 0)) === 0 ? 0 : 1;
}

/*
 Sets the least significant bit to 1 or 0 (depending on the bit to set)
 */
export function packBit(bufferItem: Rgba, bit: Binary): Rgba {
  if (bit === 0) {
    return bufferItem & ~(1 << 0);
  }
  // Else 1
  return bufferItem | (1 << 0);
}

/**
 * Takes a char like 65 and convert it to "1001111";
 * Always return 8 bits
 **/
export function charToBinaryString(charCode: number): string {
  return ("000000000" + charCode.toString(2)).substr(-8);
}
/**
 * Extract a binary ("10011001") to a char
 **/
export function binaryStringToChar(input: string): string {
  return String.fromCharCode(parseInt(input, 2));
}

/**
 * Evaluate the number of byte required for an image to embedded the desired message.
 *
 * Can be used to avoid inserting message on a small image or to choose in a collection
 * of image the best one to embedded the message.
 *
 * Assume the message as the EOF character
 **/
export function getMinimumImageSizeByteRequired(message: string): number {
  const totalLetter = message.length;
  const numberOfColorNeeded = totalLetter * NUMBER_BIT_PER_BYTE;
  return numberOfColorNeeded;
}

/**
 * Determine if a buffer (mostly coming from the bytes from  an image) is big enough for
 * a message to be inserted
 **/
export function isBufferBigEnoughForMessage(message: string, buffer: ArrayBuffer): boolean {
  return getMinimumImageSizeByteRequired(message) <= buffer.byteLength;
}
/*
Add data into a section of the image starting at a specific position
@buffer: Buffer with all pixels of an existing image
@position: Where we are in term of adding new content
@dataToAdd: Data to insert in the section
@return: A new buffer that has the same size of the input buffer
*/
export function addMessageIntoBuffer(buffer: ArrayBuffer, dataToAdd: string): Buffer {
  const dataToAddWithEOF = dataToAdd + EOF_CHAR;
  if (!isBufferBigEnoughForMessage(dataToAddWithEOF, buffer)) {
    throw Error("The message is too big for the buffer");
  }
  const existingBufferValues = new Uint8Array(buffer);
  const newBuffer: Buffer = Buffer.alloc(buffer.byteLength); // Pixel color for the new image
  let slidingImagePosition = 0; // Position into the buffer
  let dataPosition = 0;
  for (; dataPosition < dataToAddWithEOF.length; dataPosition++) {
    if (slidingImagePosition >= newBuffer.length) {
      throw Error(
        "The content is too big for the image size. The logic on isBufferBigEnoughForMessage has a flaw."
      );
    }
    const currentColor: Rgba | undefined = newBuffer.at(slidingImagePosition);
    if (currentColor === undefined) {
      throw Error(
        "The content is too big for the image size.  The logic on isBufferBigEnoughForMessage has a flaw."
      );
    }
    const char = dataToAddWithEOF.charCodeAt(dataPosition);
    const charBin = charToBinaryString(char);
    for (let j = 0; j < NUMBER_BIT_PER_BYTE; j++) {
      const bit: Binary = Number(charBin[j]);
      newBuffer[slidingImagePosition] = packBit(existingBufferValues[slidingImagePosition], bit);
      slidingImagePosition++;
    }
  }
  return newBuffer;
}

export function getMessagerFromBuffer(buffer: ArrayBuffer): string {
  let result = "";
  let dataPosition = 0;
  let lastCharacter: string = "";
  let bitCounter = 0;
  let bits = "";
  const newBuffer = new Int8Array(buffer);
  while (lastCharacter !== EOF_CHAR && dataPosition < newBuffer.length) {
    while (bitCounter < NUMBER_BIT_PER_BYTE) {
      const rgbColor = newBuffer.at(dataPosition);
      if (rgbColor === undefined) {
        throw Error("Reading fail");
      }
      bits += unpackBit(rgbColor);
      dataPosition++;
      bitCounter++;
    }

    lastCharacter = binaryStringToChar(bits);
    if (lastCharacter !== EOF_CHAR) {
      result += lastCharacter;
    }
    // Resets for the next char
    bitCounter = 0;
    bits = "";
  }
  return result;
}

export async function addMessageToImage(
  message: string,
  inputImageFullPath:
    | Buffer
    | Uint8Array
    | Uint8ClampedArray
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | string,
  outputImageFullPath: string
): Promise<void> {
  const { data } = await sharp(inputImageFullPath).raw().toBuffer({ resolveWithObject: true });
  const newBuffer = addMessageIntoBuffer(data.buffer, message);
  await sharp(newBuffer).toFile(outputImageFullPath);
}

export async function getMessageFromImage(
  inputImageFullPath:
    | Buffer
    | Uint8Array
    | Uint8ClampedArray
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | string
): Promise<string> {
  const { data } = await sharp(inputImageFullPath).raw().toBuffer({ resolveWithObject: true });
  const message = getMessagerFromBuffer(data.buffer);
  return Promise.resolve(message);
}
