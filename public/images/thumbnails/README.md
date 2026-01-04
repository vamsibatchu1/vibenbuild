# Thumbnails Folder

This folder contains thumbnail images for all 52 projects.

## How to Add Thumbnails

1. **Naming Convention**: Name your thumbnail images using the project week number with `.webp` format:
   - `01.webp` for Week 1
   - `02.webp` for Week 2
   - `03.webp` for Week 3
   - ... and so on up to `52.webp` for Week 52

2. **Multiple Images**: If a project has multiple thumbnails, use:
   - `01-1.webp`, `01-2.webp`, `01-3.webp` for Week 1
   - `02-1.webp`, `02-2.webp` for Week 2
   - etc.

3. **Format**: Use `.webp` format for all thumbnails (optimized for web)

4. **Image Size**: Recommended size is 800x450px (16:9 aspect ratio) for best display quality.

## Example Structure

```
thumbnails/
  ├── 01.webp
  ├── 01-2.webp
  ├── 02.webp
  ├── 03.webp
  └── ...
```

Update the `thumbnails` array in `data/projects.json` with the image paths (e.g., `["/images/thumbnails/01.webp"]`).

