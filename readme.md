[![Build, Test and Coverage](https://github.com/MrDesjardinssteganographyts/actions/workflows/action.yml/badge.svg)](https://github.com/MrDesjardins/steganographyts/actions/workflows/action.yml)
[![codecov](https://codecov.io/gh/MrDesjardins/steganographyts/branch/master/graph/badge.svg?token=0HGGX9Z9OW)](https://codecov.io/gh/MrDesjardins/steganographyts)
[![](https://img.shields.io/badge/Benchmark-%E2%9C%85-brightgreen)](https://mrdesjardins.github.io/steganographyts/dev/bench/)
![ESNext Target](https://img.shields.io/badge/Target-ESNEXT-brightgreen.svg?style=plastic)
![CommonJs Target](https://img.shields.io/badge/Target-CommonJS-brightgreen?style=plastic)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=plastic&logo=typescript&logoColor=white)
![npm](https://img.shields.io/npm/dt/steganographyts?label=NPM%20download&style=plastic)

# Steganography TypeScript

Embeded a string into an existing image.

# What is Steganography?

[Wikipedia](https://en.wikipedia.org/wiki/Steganography) defines steganography:

> the practice of representing information within another message or physical objec

This library uses a known technic which is to hide the bytes of the message into the bytes of the color.

# How to Use the Library

## How to install the Steganography TypeScript Library

```sh
npm install --save steganographyts
```

## How to add a string into an image

```typescript
await addMessageToImage("Your message", "./yourimage.png", "./imagewithmessage.png");
```

## How to extract the string from an image

```typescript
const message = await getMessageFromImage(
  "./imagewithmessage.png"
);
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

