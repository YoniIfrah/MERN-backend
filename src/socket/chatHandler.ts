import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Message from '../models/message_model'

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
                
    // {'to': destination user id,
    //   'message' : message to send}

    const sendMessage = async (payload) => {
        const message = new Message({
            message:payload.message,
            sender:payload.from,
            reciver:payload.to
        })
        try {
            const newMessage = await message.save()
            console.log("saved message successfully:", newMessage)
            io.to(message.reciver).emit("chat:message",{
                'to':message.reciver, 'from': message.sender, 'message':message.message})

        } catch (error) {
            socket.emit("chat:message", { status: "fail" });
        }
    }

    const getAllMessageById = async (payload) => {
        console.log('chat:get all msgs by id')
        let messages ={}
        try {
            const senderMessages = await Message.find({ sender: payload.sender })
            const receiverMessages = await Message.find({ reciver: payload.sender })
            messages = senderMessages.concat(receiverMessages)
            io.to(socket.data.user).emit("chat:get_all_messages_by_id", messages)
        } catch (error) {
            socket.emit("chat:get_all_messages_by_id", { status: "fail" });
        }

    }
    console.log('register chat handlers')
    socket.on("chat:send_message", sendMessage)
    socket.on("chat:get_all_messages_by_id", getAllMessageById)

}