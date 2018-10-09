# warble

A tool that ties into MPX. Uses their identity services (logging in via an endpoint), to generate a token. Then does things that are inconvenient to do within the Flash-based MPX interface. For now, the only features are: login interface, memory storage for session, interface for adding an allowedValue to the Show custom field (a property of a custom field).



To use, just download the files in the repo into a folder, then host that folder somewhere (localhost or web server).

If you have PHP installed on your machine you can easily server it on localhost:<port-number> with the following command:

php -S localhost:<port-number>

(a common <port-number> for this would be 8000 or 3000. So you might enter in the command "php -S localhost:8000").



Right now this tool doesn't do much, the idea right now is to make it do the one thing it needs to with a minimum of fuss.
Then later features can be added if so desired (because there's a bunch of things we use MPX to do that could be done easier).
For instance, there's some Cue Point stuff which might be more useful to do not in MPX.


[Sketch going along with this project](sketch.png)
