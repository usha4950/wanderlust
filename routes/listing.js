const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const{storage} = require("../cloudConfig.js");
const upload = multer({storage})

// const upload = multer({storage});
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"), validateListing , wrapAsync(listingController.newCreate)
    );

router.get("/new", isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), (req,res,next)=>{
        console.log("After upload middleware");
        next();
    },validateListing, wrapAsync(listingController.Uppdate))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.Deleted)
);

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.Locked));



module.exports = router;