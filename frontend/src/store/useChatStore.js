import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) =>(
    {
        messages:[],
        users:[],
        selectedUser:null,
        isUsersLoading:false,
        isMessagesLoading:false,

        getUsers:async()=>{
            set({isUsersLoading:true})
            try{
                const res = await axiosInstance.get("/messages/user");
                set({users:res.data}) 
            }catch(error){
                toast.error(error.response.data.message)
            }finally{
                set({isUsersLoading:false})
            }
        },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res= await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
          toast.error("No user selected");
          return;
        }
      
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send message");
        }
      },
      
      subscribeToMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            // Pastikan pesan dari pengguna yang sedang dipilih tetap ditampilkan
            if (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
            }
        });
    },
    
    unSubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },
    
    
    setSelectedUser:(selectedUser) => set({selectedUser}),
}))