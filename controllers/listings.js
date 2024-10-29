const Listing=require("../models/listing.js");

const mapToken=process.env.MAP_API_KEY;

const axios = require('axios');

// Your Geoapify API key
const apiKey = process.env.GEOKEY;


module.exports.index=async(req,res,next)=>{
    const allListings=await Listing.find({});
    
    res.render("./listings/index.ejs",{allListings});
     }

module.exports.rendernewform=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","listing ypou requested for does not exist!");
        res.redirect("/listings");
    }
   res.render("./listings/show.ejs",{listing})
}
 
module.exports.createListing = async (req, res, next) => {
  const address = req.body.listing.location;
  const title = req.body.listing.title;

  // Check if a similar listing already exists
  const existingListing = await Listing.findOne({ title, location: address });
  if (existingListing) {
    req.flash("error", "A listing with this title and location already exists!");
    return res.redirect("/listings");
  }

  // Geocode Address Function
  const geocodeAddress = async () => {
    try {
      const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${mapToken}`;
      const response = await axios.get(geocodingUrl);

      if (response.data.features.length > 0) {
        const location = response.data.features[0];
        const coordinates = location.geometry.coordinates;
        return {
          type: 'Point',
          coordinates: [coordinates[0], coordinates[1]]
        };
      } else {
        console.log(`No results found for the address: ${address}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return null;
    }
  };

  // Create new listing with geocoded address
  const { path: url, filename } = req.file;
  const newListing = new Listing({
    ...req.body.listing,
    owner: req.user._id,
    image: { url, filename },
    geometry: await geocodeAddress()
  });

  const savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing){
    req.flash("error","listing ypou requested for does not exist!");
    res.redirect("/listings");
}
let originalImageUrl=listing.image.url;
originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
   res.render("listings/edit.ejs",{listing,originalImageUrl}); 
     
 }

 module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const address = req.body.listing.location;
  
  // Function to get coordinates
  const geocodeAddress = async () => {
    try {
      const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${mapToken}`;
      const response = await axios.get(geocodingUrl);

      if (response.data.features.length > 0) {
        const location = response.data.features[0];
        const coordinates = location.geometry.coordinates; // [longitude, latitude]
        return {
          type: 'Point',
          coordinates: [coordinates[0], coordinates[1]] // GeoJSON format
        };
      } else {
        console.log(`No results found for the address: ${address}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return null;
    }
  };

  // Call geocodeAddress and get coordinates
  const geometry = await geocodeAddress();

  // Update listing and geometry if coordinates are available
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (geometry) {
    listing.geometry = geometry; // Set geometry to returned coordinates
  }

  // Update image if a new file is uploaded
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save(); // Save updated listing
  res.redirect(`/listings/${id}`);
};

//delete
module.exports.deleteListings=async(req,res)=>{
    let {id}=req.params;
    let deltedListing=await Listing.findByIdAndDelete(id);
    console.log(`deleted list:${deltedListing}`);
    req.flash("success"," Listing deleted!")
    res.redirect("/listings");
   }

   //filter route
  module.exports.filterListings=async (req, res) => {
    let allListings;
  
    if (req.query.feature && req.query.feature !== "" && req.query.feature !="a") {
        allListings = await Listing.find({ features: req.query.feature })
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
    } else { if(req.query.feature=="a")
        allListings = await Listing.find({});
        req.flash("error", "The listing you requested does not exist!");
    }
  
    if (!allListings || allListings.length === 0) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }
  
    res.render("listings/index.ejs", { allListings });
  }

  //search route
  module.exports.searchFunction=async (req, res) => {
    const { searchTerm } = req.query;
    let listings = [];
  
    if (searchTerm) {
      // Search for listings where the title, location, or description matches the search term
      listings = await Listing.find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } }
        ]
      }).populate("owner").populate({
        path: "reviews",
        populate: { path: "author" }
      });
    }
  
    if (listings.length === 0) {
      req.flash("error", "No listings match your search.");
    }
  
    res.render("listings/index.ejs", { allListings: listings });
  }

  
  

