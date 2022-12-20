import Benchmark from "benchmark";
import { LoremIpsum } from "lorem-ipsum";
import { addMessageIntoBuffer } from "../src/index";
const suite = new Benchmark.Suite({
  minSamples: 1000,
});

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});
// add tests
suite
  .add("addMessageIntoBuffer Small Message", function () {
    const message = lorem.generateSentences(1);
    const buffer: Buffer = Buffer.alloc(message.length * 8 + 8, "A");
    addMessageIntoBuffer(buffer, message);
  })
  .add("addMessageIntoBuffer Medium Message", function () {
    const message = lorem.generateParagraphs(7);
    const buffer: Buffer = Buffer.alloc(message.length * 8 + 8, "A");
    addMessageIntoBuffer(buffer, message);
  })
  .add("addMessageIntoBuffer Long Message", function () {
    const message = lorem.generateParagraphs(20);
    const buffer: Buffer = Buffer.alloc(message.length * 8 + 8, "A");
    addMessageIntoBuffer(buffer, message);
  })
  // add listeners
  .on("cycle", function (event: any) {
    console.log(String(event.target));
  })
  .on("complete", (event: any) => {
    /*     const suite = event.currentTarget;
    const fastestOption = suite.filter("fastest").map("name");

    console.log(`The fastest option is ${fastestOption}`); */
  })
  .on("error", (event: any) => {
    console.log("Error");
    console.log(event);
  })
  .run();
