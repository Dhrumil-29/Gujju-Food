import userModel from "../models/userModel.js";

//add items to cart
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "error" });
  }
};

//remove from cart
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Remove From Cart" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "error" });
  }
};

//fetch user cart data
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "error" });
  }
};

export { addToCart, removeFromCart, getCart };
