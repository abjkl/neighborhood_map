# neighborhood_map

neighborhood_map is the 5th project for Full Stack Web Developer course.

## Browsers & Enviorment & Frameworks

### Browers
Your browsers should support HTML5. The lastest version of Chrome, Safari and Firefox is fine. If you use IE,  IE10 and above is preferred.

### jQuery
The work uses ```jQuery 3.2.1 ```.

### Knockoutjs
The work uses ```knockout.3.4.2 ```. And the file is already in the project.

### font-awesome-4.0.7
I also use ```font-awesome-4.0.7 ``` to show the icon in the html.


## API Used

### Googlemaps JavaScript API
This api is used for generate the map and handle the popup information of the map.

### Bart informtion API
The Bart station is get from ```www.bart.gov ```, who supply the coders with api to get the real time information about the stations.

## How to use

### Load the map
1. Make sure you have download __ all __  the files in the  repository。
2. Open the index.html with your browser.(Chrome, Safari, Firefox or IE10 above.

### Show markers' information
There are two ways to show marker's information.
1. Click the markers on the map.
2. Click the station's name on the left hand list.

### Filter the stations
You can input whatever you want to search the station you want. The result will show after you click the __ Filter __ button.
__ Please notice __ that the input is  case-sensitive, which means 'Station A' is different from "station a";

### API request error
If the API form BART load for more than 5 second, there will be a notice on the nav part of the webpage.

## Document

### map_init.js
This file contains the main code to initiate the map and the list.

### mapstyle.js
This file contains the value of the styles of  the map. For example, the color of the water and the font-size of the information on the map.

### style.css
This file define the outlook of the index.html.

### index.html
You can run the progame by opening this file.
