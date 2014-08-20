# Javascript simple image color extractor

Extracts the main color of a given image, determined by Euclidean distance of RGB values

### How it works

 * Creates canvas element of image
 * Loops through subset of pixels and stores colors
 * Finds the distance between each color and all other colors
 * Selects the color with the lowest aggregate distance (RGB values in Euclidean space)


### How to use

```javascript
$('#imgelement').on("load", function() {
	var mainColor = getHex(this);
});
```

 * Easily extendable - feel free to select the average color of the 10 lowest-aggregate-distance colors

To-do: k-means to find main color


### Credit/props:

 * [lwburk at StackOverflow](http://stackoverflow.com/questions/5162828/how-to-get-the-average-or-main-color-from-an-image-with-javascript) for the canvas drawing and map code
