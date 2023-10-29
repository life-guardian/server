const app = require("express")();

const notAgency = app.use(async (req, res, next) => {
    try {
      const isAgency = req.user.isAgency;
  
      if (isAgency) {
          return res.status(401).json({ message: "Cannot perform action. You are an agency" });
      }
  
      next();
    } catch (error) {
      console.error(`Error in notAgency middleware: ${error}`);
      return res.status(401).json({ message: "Cannot determine agency status. you shouldn't be an agency to access this route" });
    }
});


module.exports = notAgency;
  