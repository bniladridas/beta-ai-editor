# Dev Journal Website Template

A clean, modern journal-style website template for publishing technical blog posts and developer experiences.

## Features

- Responsive design that works on all devices
- Clean, readable typography optimized for technical content
- Syntax highlighting for code blocks
- Automatic table of contents generation
- Reading time estimation
- Newsletter subscription form
- Related articles section
- Author information widget
- Social media integration

## Usage

1. Clone the repository
2. Open `index.html` in your browser to view the template
3. Customize the content, styles, and scripts as needed

## Structure

- `index.html` - The main HTML file containing the blog post content
- `styles.css` - CSS styles for the website
- `script.js` - JavaScript functionality including table of contents generation and reading time calculation

## Customization

### Changing Colors

The color scheme can be easily modified by changing the CSS variables at the top of the `styles.css` file:

```css
:root {
    --primary-color: #4a6baf;
    --secondary-color: #f8a978;
    --dark-color: #2c3e50;
    --light-color: #f5f7fa;
    --text-color: #333;
    --border-color: #e1e4e8;
    --code-bg: #282c34;
    --card-bg: #f8f9fa;
    --success-color: #2ecc71;
    --warning-color: #f39c12;
    --danger-color: #e74c3c;
    --info-color: #3498db;
}
```

### Adding New Articles

To create a new article:

1. Duplicate the `index.html` file
2. Update the content in the `<article class="post-content">` section
3. Update the metadata in the hero section
4. Update the sidebar content as needed

## Dependencies

- [Font Awesome](https://fontawesome.com/) - For icons
- [highlight.js](https://highlightjs.org/) - For code syntax highlighting

## License

MIT
