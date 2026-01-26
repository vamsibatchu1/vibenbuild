# Experiments2 Images

This folder contains images for the experiments2 page.

## Naming Convention

Images should follow this naming pattern:
- `{experiment-number}-{image-number}.webp`

For example:
- `01-01.webp` - First image for Experiment 01
- `01-02.webp` - Second image for Experiment 01
- `01-03.webp` - Third image for Experiment 01
- `02-01.webp` - First image for Experiment 02
- etc.

## Folder Structure

```
experiments2/
├── 01-01.webp
├── 01-02.webp
├── 01-03.webp
├── 02-01.webp
├── 02-02.webp
├── 02-03.webp
├── ... (up to 10-03.webp)
└── README.md
```

## Image Specifications

- Format: WebP (for better optimization and smaller file sizes)
- Aspect Ratio: 16:9 (as specified in the component)
- Recommended dimensions: 360px width (to match column width) or larger for retina displays

## Usage

Replace the placeholder files with your actual images. The component will automatically load images based on the experiment's imageIndex values.
