import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "./../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save();     //!why this both line of approach is not good because 1st conversation document will save but at this time newMessage document is not saved yet. so the messages field in conversation model will be an empty , there supposed to be a newMessage id but conversation saved first then newMessage saved so we can do vice-versa but lets try new approach which are promise.all
    // await newMessage.save();

    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(200).json({ newMessage: newMessage });
  } catch (err) {
    console.log("Error in sendMessage controller", err.message); //if any error occurred during try section it will catch error here!
    res.status(500).json({ error: "Internal server error!" }); //and send error to the client with status code of 500 which is server error code
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params; //will get id from params url.

    console.log("receiver", receiverId);
    console.log("sender", req.userId);
    const conversation = await Conversation.findOne({
      participants: { $all: [req.userId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      res.status(200).json({ err: "No conversation found!" });
    } else {
      const senderId_Populate = conversation?.messages?.map(
        (msg) => msg.message
      );
      console.log(senderId_Populate);
      return res.status(200).json({
        msg: senderId_Populate,
      });
    }
    // if (conversation === null) {
    //   return res.status(200).json({ msg: "No messages found!" });
    // }
    // const senderBio_Data_id = (await conversation.populate("senderId"))._id;
    // const receiverBio_Data_id = (await conversation.populate("receiverId"))._id;
    // const sender_Actual_Bio_Data = await User.findById(se
    // nderBio_Data_id);
    // const receiver_Actual_Bio_Data = await User.findById(receiverBio_Data_id);
    // const messages_Actual = conversation.message;
    // console.log("conversation", conversation);
    // return res.status(200).json({
    //   senderName: sender_Actual_Bio_Data,
    //   receiverName: receiver_Actual_Bio_Data,
    //   messages: messages_Actual,
    // });
  } catch (err) {
    console.log("Error in getMessage controller", err.message); //if any error occurred during try section it will catch error here!
    res.status(500).json({ error: "Internal server error!" }); //and send error to the client with status code of 500 which is server error code
  }
};
