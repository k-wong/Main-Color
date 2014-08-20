/** 
	simple predominant color finder [O(n^2 + nlogn)]
	author kevin wong
	year 2014
**/

/** takes in img element and returns a string (#XXXXXX) of the most predominant color
	input: image element
	output: string hex code in #XXXXXX format
**/
function getHex(img) {
	var colors = getColorMap(draw(img));
	var mainColors = getMainColors(colors);
	mainColors.sort(compare);
	return "#" + pad(mainColors[0].hex);
}

function HexPair(hex, dist) {
	this.hex = hex;
	this.dist = dist;
}

/** returns canvas context of img element
	input: image element
	output: canvas of image
	author lwburk @ so
**/
function draw(img) {
    //img.crossOrigin = '';
    var canvas = document.createElement("canvas");
    var c = canvas.getContext && canvas.getContext('2d');
    c.width = canvas.width = img.width;
    c.height = canvas.height = img.height;
    c.clearRect(0, 0, c.width, c.height);
    c.drawImage(img, 0, 0, img.width , img.height);
    return c;
}

/** returns a map counting the frequency of each color
	in the image on the canvas
	input: canvas context
	output: Map of colors (key=hex string, value=frequency)
	author lwburk @ so
**/
function getColorMap(c) {
    var col, colors = {};
    var pixels, r, g, b, a;
    r = g = b, a = 0;
    pixels = c.getImageData(0, 0, c.width, c.height);
    var divisor = Math.min(pixels.data.length, 250);
    var increment = Math.ceil(pixels.data.length/divisor);
    for (var i = 0, data = pixels.data; i < data.length; i += (increment) ) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3]; // alpha
        // skip pixels >50% transparent
        if (a < (255 / 2))
            continue; 
        col = rgbToHex(r, g, b);
        if (!colors[col])
            colors[col] = 0;
        colors[col]++;
    }
    return colors;
}

/** given an array of hex colors
	sorts array on total euclidean distance from the rest of the hex values
	input: map of hex colors
	output: unsorted array of HexPairs
	TO-DO: k-means clustering
**/
function getMainColors(colors) {
	var i = 0;
	var mainColors = [];
	for (var hex in colors) {
		for (var hex2 in colors) {
			if (!mainColors[i])
				mainColors[i] = new HexPair(hex, 0);
			mainColors[i].dist += getDistance(hex,hex2)/1000; //to keep as Integer
		}
		i++;
		// a color close to the main will probably have occurred after 150 colors
		// later sorting of this array by distance will return us what we want
		if (mainColors.length > 150) 
			return mainColors;
	}

	return mainColors;
}


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

/** returns Euclidean distance between two hex strings
	input: strings hex1, hex2
**/
function getDistance(hex1, hex2) {
     var r1, g1, b1, r2, g2, b2;
     r1 = parseInt(hex1.substring(0,2),16);
     g1 = parseInt(hex1.substring(2,4),16);
     b1 = parseInt(hex1.substring(4,6),16);

     r2 = parseInt(hex2.substring(0,2),16);
     g2 = parseInt(hex2.substring(2,4),16);
     b2 = parseInt(hex2.substring(4,6),16);

     return Math.sqrt(Math.pow(r2 - r1,2) + Math.pow(g2-g1,2) + Math.pow(b2-b1,2));
}

/** rotates rgb values of hex color
	input: string hex
	output: string
**/
function rotateHex (hex) {
     var r, g, b;
     r = parseInt(hex.substring(0,2),16);
     g = parseInt(hex.substring(2,4),16);
     b = parseInt(hex.substring(4,6),16);

     return rgbToHex(b,r,g);
}

// nicely formats hex values
function pad(hex) {
    return ("000000" + hex).slice(-6);
}

function compare(a,b) {
	if (a.dist < b.dist)
		return -1;
 	if (a.dist > b.dist)
		return 1;
	return 0;
}