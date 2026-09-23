# Walter G. Park research website

This is a static academic website designed for free hosting with GitHub Pages.

## Preview it locally

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create Walter's GitHub account.
2. Create a public repository named `walterpark.github.io` (replace `walterpark` with his exact GitHub username).
3. Upload every file and folder from this project except `.source-docs` and `tools`.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
6. Save and wait a few minutes for the address to become available.

## Add a new document

The current archive was generated from the original `index.html`. For a new item:

1. Add the PDF or spreadsheet to `assets/documents/`.
2. Open `research-data.js`.
3. Add a new entry near the beginning of the `entries` list using the format below.

```js
{
  "category": "articles",
  "categoryLabel": "Articles",
  "year": 2026,
  "html": "<a href=\"assets/documents/example.pdf\" target=\"_blank\"><em>Paper title</em></a>, Journal Name, 2026.",
  "search": "paper title journal name 2026",
  "order": 0
},
```

Available categories are `books`, `articles`, `chapters`, `blogs`, `presentations`, `projects`, and `working`.

## Before publishing

- Ask Walter for a short biography, current title and institution, contact details, and optional photograph or CV.
- Confirm that each hosted paper may legally be shared publicly.
- Links with a dotted underline indicate that the referenced file was not included in the supplied archives.
