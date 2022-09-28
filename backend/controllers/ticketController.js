const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// Get user tickets
const getTickets = async (req, res) => {
  // get user using the id and jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // find ticket by the user
  const tickets = await Ticket.find({ user: req.user.id });
  res.status(200).json(tickets);
};

// Get user ticket
const getTicket = async (req, res) => {
    // get user using the id and jwt
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    // find ticket by the user
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }
    // specfic user ticket
    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized');
    }
    res.status(200).json(ticket);
  };


  // Delete ticket
const deleteTicket = async (req, res) => {
    // get user using the id and jwt
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    // find ticket by the user
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }
    // specfic user ticket
    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized');
    }
    await ticket.remove();
    res.status(200).json({success: true});
  };

  // Update ticket
  const updateTicket = async (req, res) => {
    // get user using the id and jwt
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401);
      throw new Error("User not found");   
    }
    // find ticket by the user
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        res.status(404)
        throw new Error('Ticket not found')
    }
    // specfic user ticket
    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('Not authorized');
    }
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedTicket);
  };

// Get user ticket
const createTicket = async (req, res) => {
  const { product, description } = req.body;
  if (!product || !description) {
    res.status(400);
    throw new Error("Please add a product and description");
  }
  // get user using the id and jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.create({  
    product,
    description,
    user: req.user.id,
    status: 'new'
  })
  res.status(201).json(ticket);
};

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket
};
