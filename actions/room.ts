"use server"

import { RoomServiceClient, Room } from 'livekit-server-sdk';
import { getSelf } from '@/lib/auth-service';


export const createRoom = async () => {

  const self = await getSelf();

  const roomService = new RoomServiceClient(process.env.LIVEKIT_API_URL!, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!);

  const opts = {
    name: self.username + "'s room",
    emptyTimeout: 10 * 60, // 10 minutes
    maxParticipants: 20,
  };
  roomService.createRoom(opts).then((room: Room) => {
    console.log('room created', room);
  });

}