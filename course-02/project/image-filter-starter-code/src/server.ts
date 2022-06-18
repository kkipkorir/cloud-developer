import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
 
  //gets an image from a public url and filters it and returns the result
  app.get("/filteredimage", async ( req, res) => {

  //get Image url from the request
  let {  image_url: imageUrl } = req.query;

  //handles the case where the image url is not provided
  if (!imageUrl) {
    return res.status(400).send('Provide an image url');
  }

  // send the resulting file in the response
  // deletes any files on the server on finish of the response
try{
  let imageFilterResult = await filterImageFromURL(imageUrl)

  return res.status(200).sendFile(imageFilterResult, (f) => {
     deleteLocalFiles([imageFilterResult])
   });
  }

  // Handles the case where link is the broken
  catch(error){
   return  res.status(422).send("Unable to download image");
  }
     
});
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();