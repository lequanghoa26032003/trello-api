
export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện và Client gửi lên có tên là FE_USER_INVITED_BOARD
  socket.on('FE_USER_INVITED_BOARD', (invitation) => {
    socket.broadcast.emit('BE_USER_INVITED_BOARD', invitation)
   })
}