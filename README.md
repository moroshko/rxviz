# <a href='https://rxviz.com'><img src='https://user-images.githubusercontent.com/259753/26937967-b6bd7262-4c27-11e7-97f3-29878d7ec468.png' height='60' alt='RxViz logo'></a>

* [Description](#description)
* [Examples](#examples)
  * [Basic Interval](#basic-interval)
  * [Random error](#random-error)
  * [Higher order Observable](#higher-order-observable)
  * [Pause and resume](#pause-and-resume)
* [How it works?](#how-it-works)
  * [How about higher order Observables?](#how-about-higher-order-observables)
* [Thanks](#thanks)
* [Running locally](#running-locally)

## Description

RxViz simply visualizes a given Observable. You can type any JavaScript you want in the editor. We will evaluate it, and, if the last expression is an Observable, a nice animated visualization will appear. 

To control the speed of the animation, **Time window** input is provided.

Once the animation has ended, feel free to copy the resulting SVG to include it in your next Rx presentation.

## Examples

### Basic interval

[![rxviz-basic-interval](https://user-images.githubusercontent.com/259753/26908333-f27e17f8-4bae-11e7-87b8-3851778e9cf6.gif)](https://rxviz.com/examples/basic-interval)

### Random error

[![rxviz-random-error](https://user-images.githubusercontent.com/259753/26908364-0e4bab80-4baf-11e7-8896-921ee978a337.gif)](https://rxviz.com/examples/random-error)

### Higher order Observable

[![rxviz-higher-order-observable](https://user-images.githubusercontent.com/259753/26908347-fefb6fa8-4bae-11e7-8d06-0658e3cf1e17.gif)](https://rxviz.com/examples/higher-order-observable)

### Pause and resume

[![rxviz-pause-and-resume](https://user-images.githubusercontent.com/259753/26908310-bb0f8540-4bae-11e7-9bb7-9520ec567fdf.gif)](https://rxviz.com/examples/pause-and-resume)

## How it works?

RxViz treats the evaluated Observable as a black box. We rely only on the fact that Observable emits values over time. RxViz doesn't rely on the internal implementation of RxJS. This will allow us to visualize [TC39 Observables](https://github.com/tc39/proposal-observable) in the future.

Technically, we subscribe to the given Observable, and, once a value is observed, we simply add it to the visualization. It's that simple!

### How about higher order Observables?

No different. Since a higher order Observable is simply an Observable whose values are Observables themselves, we just repeat the process recursively.

When an Observable value is seen, we subscribe to it. At this point, we create a new "branch" in the visualization.

## Thanks

* [Vedran Arnautović](https://twitter.com/vedranio) for designing [rxviz.com](https://rxviz.com)
* [Yuki Izumi](https://github.com/kivikakk) for always being helpful with random questions I have
* [zeit.co](https://zeit.co) for outstanding developer experience with [next.js](https://github.com/zeit/next.js) and [domains](https://zeit.co/domains)
* [André Staltz](https://twitter.com/andrestaltz) for creating [rxmarbles.com](http://rxmarbles.com) and [awesome RxJS courses on egghead.io](https://egghead.io/courses#technology-rx)
* [Canny](https://canny.io) for efficiently collecting [user feedback](https://rxviz.canny.io/feature-requests)

## Running locally

```bash
npm install
npm run dev
```
