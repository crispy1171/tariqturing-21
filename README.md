
# Tariq Turing - Interactive Turing Machine Visualizer

An interactive web application for learning and visualizing Turing Machines.

## Features

- Interactive Turing Machine Simulator
- Step-by-step tutorial for learning Turing Machine concepts
- Visual state diagram representation
- Guided learning path

## Deployment

This project is configured to be deployed on GitHub Pages.

### GitHub Pages Deployment Steps

1. Build the project:
   ```
   npm run build
   ```

2. Deploy the `dist` folder to GitHub Pages.

3. For manual deployment, push the `dist` folder to the `gh-pages` branch:
   ```
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

## Development

To run the project locally:

```
npm install
npm run dev
```

## Author

Developed by Tariq AYYAD.

## License

This project is open source and available under the MIT License.
