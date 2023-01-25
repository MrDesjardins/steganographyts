[![Build, Test and Coverage](https://github.com/MrDesjardins/steganographyts/actions/workflows/action.yml/badge.svg?branch=master)](https://github.com/MrDesjardins/steganographyts/actions/workflows/action.yml)
[![codecov](https://codecov.io/gh/MrDesjardins/steganographyts/branch/master/graph/badge.svg?token=0HGGX9Z9OW)](https://codecov.io/gh/MrDesjardins/steganographyts)
[![](https://img.shields.io/badge/Benchmark-%E2%9C%85-brightgreen)](https://mrdesjardins.github.io/steganographyts/dev/bench/)
![ESNext Target](https://img.shields.io/badge/Target-ESNEXT-brightgreen.svg?style=plastic)
![CommonJs Target](https://img.shields.io/badge/Target-CommonJS-brightgreen?style=plastic)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=plastic&logo=typescript&logoColor=white)
[![](https://img.shields.io/npm/v/@mrdesjardins/steganography?style=plastic)](https://www.npmjs.com/package/@mrdesjardins/steganography)

# Steganography TypeScript

Embeded a string into an existing image.

# What is Steganography?

[Wikipedia](https://en.wikipedia.org/wiki/Steganography) defines steganography:

> the practice of representing information within another message or physical objec

This library uses a known technic which is to hide the bytes of the message into the bytes of the color.

More information in this [blog article](https://patrickdesjardins.com/blog/what-is-steganography-how-to-hide-text-in-image) about how I implemented the Steganography in this library.

You can find a [Rust Steganography](https://github.com/MrDesjardins/steganographyrs) implementation on Github.

This library relies on the least significant bits.

# What is Least Significant Bits?

1. [Blog Post about using the least significant bits](https://patrickdesjardins.com/blog/what-is-steganography-how-to-hide-text-in-image)

# How to Use the Library

## How to install the Steganography TypeScript Library

```sh
npm install --save steganographyts
```

## How to add a string into an image

```typescript
await addMessageToImage("Your message", "./yourimage.png", "./imagewithmessage.png");
```

## How to add a string into an image with the string encrypted

```typescript
await addMessageToImage("Your message", "./yourimage.png", "./imagewithmessage.png", {
  password: "Your password here",
});
```

## How to extract the string from an image

```typescript
const message = await getMessageFromImage("./imagewithmessage.png");
```

## How to extract an encrypted string from an image

```typescript
const message = await getMessageFromImage("./imagewithmessage.png", {
  password: "Your password here",
});
```

# Information for Developer

## Build

The build produces a EcmaScript Module and a CommonJS Module into the `dist` folder. The TypeScript map is generated in both target.

## Test

```sh
npm run test
```

## Debug

There is a VsCode Launch to debug the unit test. However, if you are running on Windows, you need to ensure you install `npm install` on the Windows machine using Powershell and not WSL as the Sharp library install different packages depending if it runs on WSL or Powershell.

# How is the Steganography TypeScript working?

If you want to get further detail about how the deta is injected into the image using this library you can follow this [blog post](https://patrickdesjardins.com/blog).
