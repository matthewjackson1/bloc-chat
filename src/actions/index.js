export const deleteRoom = (room) => {
  return {
    type: 'DELETE_ROOM',
    payload: room
  }
}