const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index = async(req,res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", {alllisting});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => { 
    let { id } = req.params; 
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author",},}).populate("Owner"); 
    // console.log(listing.Owner);
    if(!listing) { 
        req.flash("error", "Listing you requested for does not exist!"); 
        return res.redirect("/listings"); 
    } 
    res.render("listings/show.ejs", { listing }); 
};

module.exports.newCreate = async (req,res,next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
            limit:1,
        })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.Owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    
    await newListing.save();
    req.flash("success", "new listing created!");
    res.redirect("/listings");
};

module.exports.Locked = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let oriurli = listing.image.url;
    oriurlimage = oriurli.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing,oriurlimage});
};

module.exports.Uppdate = async (req, res) => {
    console.log("1. Controller started");

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    console.log("2. Listing updated");

    console.log("req.file =", req.file);

    if (req.file) {
        console.log("3. File uploaded");

        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };

        console.log("4. Before save");

        await listing.save();

        console.log("5. After save");
    }

    console.log("6. Redirect");

    res.redirect(`/listings/${id}`);
};

module.exports.Deleted = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", " listing Deleted!");
    res.redirect("/listings");
};