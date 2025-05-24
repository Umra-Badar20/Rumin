// import Contact from '../models/Contact.js';

// // @desc    Create new contact message
// // @route   POST /api/contact
// // @access  Public
// export const createContact = async (req, res, next) => {
//   try {
//     const contact = await Contact.create(req.body);
//     res.status(201).json({
//       success: true,
//       data: contact
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // @desc    Get all contact messages
// // @route   GET /api/contact
// // @access  Private
// export const getContacts = async (req, res, next) => {
//   try {
//     const contacts = await Contact.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: contacts.length,
//       data: contacts
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// };
import Contact from '../models/Contact.js';

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete a contact inquiry
// @route   DELETE /api/contact/:id
// @access  Private
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Contact.findById(req.params.id);
console.log(`User ${req.user.id} deleted inquiry ${inquiry._id}`);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }

    // Verify the user is authorized to delete (optional)
    // You might want to add admin verification here
    // if (inquiry.user.toString() !== req.user.id) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Not authorized to delete this inquiry'
    //   });
    // }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log(`User ${req.user.id} deleted inquiry ${inquiry._id}`);
    console.error(`Error deleting inquiry: ${err.message}`);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};