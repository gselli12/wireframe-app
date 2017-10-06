# Wireframe App

## Summary:
This Wireframe App is a quick an easy wireframe app, that is intended to make the developer take a step back and think about the UI of the final product, before starting to code. An app like that also allows for easier communication between designers and developers.
The app is built using fabric.js as a drawing library and jQuery to manipulate the DOM.

Hosted on [Heroku](https://wireframe-thomas.herokuapp.com/) (using the free Heroku plan, so it might take a few seconds to load)

## Demo:
![Wireframe App GIF](https://github.com/gselli12/wireframe-app/blob/master/Images/gifForReadme.gif)

## Tech Stack:
* jQuery
* Fabric.js
* PostgreSQL database
* Express server

## Main features:
1. Creating predefined elements using the buttons at the top of the window.
2. Elements can be moved using drag and drop.
3. Creating elements on mouse-drag: size and position of mouse-drag are remembered and objects created are created in that size and position.
4. Saving & loading wireframes from database.
5. Features on right mouse click (on an active element):
    * Copy, Cut, Pasting single element
    * Grouping and ungrouping elements
    * Changing background color of certain elements
    * Layering elements on top of each other.
6. Keyboard shortcuts (on an active element):
    * Copy, Cut, Paste
    * Delete
7. Setting options:
    * View options:
      - Grid view: grid size can be adapted. Elements align with grid when dragging them
      - Column view: allows you to make sure elements are horizontally aligned.
    * Styling options:
      - Background color: allows you to set the background color of your canvas
      - Default fill color: allows you change the default fill color. All rectangles and circles created after that will have that fill color.
      - Default font color: allows you to change the default font color. All text elements created after that will have that fill color.
    * Layout options:
      - Laptop: displays canvas as a web browser to design web apps
      - Phone: displays canvas as a phone to allow for design for Apps on phone (not functional yet)
      - Tablet: displays canvas as a tablet to allow for design for Apps on tablets (not functional yet).
8. Current cursor position, element position, and element sizes are displayed in the bottom left corner.

## To do's for the future:
* Make phone and tablet layout option functional.
* Allow for image upload.
* Allow changing the background color of image elements, input fields, and buttons.
* Bug fixes

### Sample wireframe created:
![Wireframe App example](https://github.com/gselli12/wireframe-app/blob/master/Images/sample_wireframe.PNG)
