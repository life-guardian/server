const app = require("express")();

const isAgency = app.use(async (req, res, next) => {
    try {
      const isAgency = req.user.isAgency;
  
      if (!isAgency) {
          return res.status(401).json({ message: "Agency authorization failed" });
      }
  
      next();
    } catch (error) {
      console.error(`Error in isAgency middleware: ${error}`);
      return res.status(401).json({ message: "Agency authorization failed" });
    }
});


module.exports = isAgency;
  