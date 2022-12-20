window.BENCHMARK_DATA = {
  "lastUpdate": 1671516370161,
  "repoUrl": "https://github.com/MrDesjardins/steganographyts",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "mrdesjardins@gmail.com",
            "name": "Patrick",
            "username": "MrDesjardins"
          },
          "committer": {
            "email": "mrdesjardins@gmail.com",
            "name": "Patrick",
            "username": "MrDesjardins"
          },
          "distinct": true,
          "id": "2dcf45cd797c152f86e4d380bcbc3580586d4b84",
          "message": "Update Readme with the missing sections",
          "timestamp": "2022-12-19T22:05:04-08:00",
          "tree_id": "ee6beef169c9aae3754e95a92e4d8c49db0531a1",
          "url": "https://github.com/MrDesjardins/steganographyts/commit/2dcf45cd797c152f86e4d380bcbc3580586d4b84"
        },
        "date": 1671516369421,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "addMessageIntoBuffer Small Message",
            "value": 38481,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "94 samples"
          },
          {
            "name": "addMessageIntoBuffer Medium Message",
            "value": 985,
            "range": "±3.06%",
            "unit": "ops/sec",
            "extra": "91 samples"
          },
          {
            "name": "addMessageIntoBuffer Long Message",
            "value": 327,
            "range": "±4.56%",
            "unit": "ops/sec",
            "extra": "82 samples"
          }
        ]
      }
    ]
  }
}