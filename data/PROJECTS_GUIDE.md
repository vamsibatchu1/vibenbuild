# How to Add/Edit Project Data

This guide explains how to add or edit project information for your 52 projects.

## File Location

All project data is stored in: **`data/projects.json`**

## Project Structure

Each project follows this structure:

```json
{
  "id": "project-01",
  "title": "Your Project Title",
  "description": "A 1-2 paragraph description of your project. This should explain what the project does, its key features, and what makes it interesting.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "thumbnails": [],
  "link": "https://your-project-link.com",
  "week": 1,
  "year": 2026
}
```

## Fields Explained

- **`id`**: Unique identifier (format: `project-01`, `project-02`, etc.)
- **`title`**: The name of your project
- **`description`**: 1-2 paragraphs describing the project
- **`tags`**: Array of tags/categories (e.g., `["AI", "Creative", "Tools"]`)
- **`thumbnails`**: Array of image paths (see "Adding Thumbnail Images" below)
- **`link`**: URL to your project (Google AI Studio link or deployed app)
- **`week`**: Week number (1-52)
- **`year`**: Year (2026)

## Adding a New Project

1. Open `data/projects.json`
2. Find the project entry for the week you want to update
3. Update the fields:
   - Change `title` to your project name
   - Update `description` with your project description
   - Add relevant `tags`
   - Update `link` with your project URL
4. Save the file

## Adding Thumbnail Images

### Automatic Detection (Recommended)

**Just drop images into the folder - no code changes needed!**

1. Go to `public/images/thumbnails/` folder
2. Add your image files using this naming (use `.webp` format):
   - Single image: `01.webp`
   - Multiple images: `01-1.webp`, `01-2.webp`, etc.
3. Use the week number (01-52) as the filename prefix
4. **That's it!** The code automatically detects and loads these images

The system will automatically:
- Scan the thumbnails folder for each project
- Find images matching the week number pattern
- Load them in order (base image first, then numbered variants)
- Display them in the project cards

**Example:**
- Drop `05.webp` into `public/images/thumbnails/`
- Drop `05-1.webp` and `05-2.webp` for additional images
- The code automatically picks them up for Week 5 project!

### Manual Override (Optional)

If you want to manually specify thumbnails in `projects.json`, you can still do so:

**Single image:**
```json
"thumbnails": ["/images/thumbnails/01.webp"]
```

**Multiple images:**
```json
"thumbnails": [
  "/images/thumbnails/01-1.webp",
  "/images/thumbnails/01-2.webp",
  "/images/thumbnails/01-3.webp"
]
```

**Note:** If `thumbnails` array is empty `[]`, the system will auto-detect images from the folder.

## Example: Updating Week 5 Project

**1. Add images to folder (automatic detection):**
- Drop `05.webp` into `public/images/thumbnails/`
- Drop `05-1.webp` for additional images (optional)
- **No code changes needed!** Images are automatically detected.

**2. Update `data/projects.json` (only project info, not images):**
```json
{
  "id": "project-05",
  "title": "My Awesome AI App",
  "description": "This is a cool app that does amazing things with AI. It helps users solve problems and create beautiful content.",
  "tags": ["AI", "Creative", "Productivity"],
  "thumbnails": [],
  "link": "https://aistudio.google.com/app/your-app-id",
  "week": 5,
  "year": 2026
}
```

**Note:** Keep `thumbnails` as empty array `[]` - images are auto-detected from the folder!

## Tips

- Keep descriptions concise but informative (1-2 paragraphs)
- Use consistent tags across similar projects
- Use descriptive tags that help categorize your work
- Images should be 16:9 aspect ratio (800x450px recommended)
- Image paths must start with `/images/thumbnails/`
- You can add multiple images per project - they'll be shown in a carousel
- If you don't have images yet, use an empty array: `"thumbnails": []`

## Quick Reference

- **Project Data**: `data/projects.json`
- **Thumbnail Images**: `public/images/thumbnails/`
- **Project Type Definition**: `types/project.ts`

