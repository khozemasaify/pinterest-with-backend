var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts");
const passport = require('passport');
const localstrategy = require("passport-local");
const upload = require('./multer');
passport.use(new localstrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/fileupload', isLoggedIn, upload.single("image"), async function (req, res, next) {
  const user  = await userModel.findOne({username:req.session.passport.user})
  user.profileImage = req.file.filename;
  await user.save()
  res.redirect("/profile")
});
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user  = await userModel.findOne({username:req.session.passport.user})
  res.render("profile", {user})
});

router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userdata = new userModel({ username, email, fullname });
  userModel.register(userdata, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    })
})
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res) {
})
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect("/")
}
// router.get('/alluserposts', async function (req, res, next) {
//   let user = await userModel.findOne({ _id: "65ce34bd66594a5bee8be793" })
//   .populate("posts")
//   res.send(user)
// });

// router.get('/createuser', async function (req, res, next) {
//   let createuser = await userModel.create({
//     username: "saify",
//     password: "saif",
//     posts: [],
//     email: "saifykhozema89@gmail.com",
//     fullname: "khuzaimazulfekarasgarali"
//   })
//   res.send(createuser)
// });
// router.get('/createpost', async function (req, res, next) {
//   let createpost = await postModel.create({
//     postText: "hello friends",
//     user: "65ce34bd66594a5bee8be793"
//   })
//   let user = await userModel.findOne({ _id: "65ce34bd66594a5bee8be793" })
//   user.posts.push(createpost._id)
//   await user.save()
//   res.send("donedonadone")
// });

module.exports = router;
