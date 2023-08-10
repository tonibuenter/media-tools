# Media Tools

## Installation

`npm install media-tools -g`

## How to Use

Execute `mediatools archive --src source-directory --dest destination-directory`.

This command will create a `destination-directory` folder, which will contain subfolders
named `albumYYYY`, `filmYYYY`, `audioYYYY`. Each of these will further contain subfolders named based on the creation
date of the media files.

The software attempts to retrieve the EXIF creation date from the media. If it's unable to do so, it will default to
using the file creation time.
```
├── album2022
│   └── 20221029
│       └── 2022_10_29__12_25-pxl_20221029_082508907.jpg
├── album2023
│   └── 20230605
│       └── 2023_06_05__10_23-nzz-abo-links-2.png
├── audio2023
│   └── 20230605
│       └── 2023_06_05__08_18-baby-belly-laugh-short.wav
└── film2022
    ├── 20221113
    │   └── 2022_11_13__13_35-1668342923121.mp4
    └── 20221231
        └── 2022_12_31__12_15-1672485326121.mp4

```
